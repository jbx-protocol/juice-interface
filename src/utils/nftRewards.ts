import { BigNumber } from '@ethersproject/bignumber'
import * as constants from '@ethersproject/constants'
import axios from 'axios'
import { JB721DelegatePayMetadata } from 'components/Project/PayProjectForm/usePayProjectForm'
import { juiceboxEmojiImageUri } from 'constants/images'
import { IPFS_TAGS } from 'constants/ipfs'
import { readNetwork } from 'constants/networks'
import { defaultAbiCoder, parseEther } from 'ethers/lib/utils'
import { DEFAULT_NFT_MAX_SUPPLY } from 'hooks/NftRewards'
import {
  IpfsNftCollectionMetadata,
  IPFSNftRewardTier,
  JB721TierParams,
  NftRewardTier,
} from 'models/nftRewardTier'
import { V2V3ContractName } from 'models/v2v3/contracts'
import { V2V3FundingCycleMetadata } from 'models/v2v3/fundingCycle'
import { decodeEncodedIPFSUri, encodeIPFSUri } from 'utils/ipfs'

import { ForgeDeploy } from './v2v3/loadV2V3Contract'

export const MAX_NFT_REWARD_TIERS = 69
const IJB721Delegate_INTERFACE_ID = '0xb3bcbb79'

// Following three functions get the latest deployments of the NFT contracts from the NPM package
async function loadNftRewardsDeployment() {
  const latestNftContractDeployments = (await import(
    `@jbx-protocol/juice-721-delegate/broadcast/Deploy.s.sol/${readNetwork.chainId}/run-latest.json`
  )) as ForgeDeploy

  return latestNftContractDeployments
}

export async function findJBTiered721DelegateProjectDeployerAddress() {
  const latestNftContractDeployments = await loadNftRewardsDeployment()
  return latestNftContractDeployments.transactions.find(
    tx =>
      tx.contractName === V2V3ContractName.JBTiered721DelegateProjectDeployer,
  )?.contractAddress
}

export async function findJBTiered721DelegateStoreAddress() {
  const latestNftContractDeployments = await loadNftRewardsDeployment()
  return latestNftContractDeployments.transactions.find(
    tx => tx.contractName === 'JBTiered721DelegateStore',
  )?.contractAddress
}

// Returns the highest NFT reward tier that a payer is eligible given their pay amount
export function getNftRewardTier({
  payAmountETH,
  nftRewardTiers,
}: {
  payAmountETH: number
  nftRewardTiers: NftRewardTier[]
}) {
  let nftReward: NftRewardTier | null = null
  // all nft's who's thresholds are below the pay amount
  const eligibleNftRewards = nftRewardTiers.filter(rewardTier => {
    return rewardTier.contributionFloor <= payAmountETH
  })
  if (eligibleNftRewards.length) {
    // take the maximum which is the only one received by payer
    nftReward = eligibleNftRewards.reduce((prev, curr) => {
      return prev.contributionFloor > curr.contributionFloor ? prev : curr
    })
  }
  return nftReward
}

// Sorts array of nft reward tiers by contributionFloor
export function sortNftRewardTiers(
  rewardTiers: NftRewardTier[],
): NftRewardTier[] {
  return rewardTiers.sort((a, b) =>
    a.contributionFloor > b.contributionFloor
      ? 1
      : b.contributionFloor > a.contributionFloor
      ? -1
      : 0,
  )
}

// returns an array of CIDs from a given array of RewardTier obj's
export function CIDsOfNftRewardTiersResponse(
  nftRewardTiersResponse: JB721TierParams[] | undefined,
): string[] {
  const cids =
    nftRewardTiersResponse
      ?.map((contractRewardTier: JB721TierParams) => {
        return decodeEncodedIPFSUri(contractRewardTier.encodedIPFSUri)
      })
      .filter(cid => cid.length > 0) ?? []

  return cids
}

// Default name for NFT collections on NFT marketplaces
export const defaultNftCollectionName = (projectName: string | undefined) =>
  `${projectName?.length ? projectName : "Your project's"} NFT rewards`

// Default description for NFT collections on NFT marketplaces
export const defaultNftCollectionDescription = (
  projectName: string | undefined,
) =>
  `NFTs rewarded to ${
    projectName?.length ? projectName : 'your project'
  }'s Juicebox contributors.`

async function uploadNftRewardToIPFS(
  rewardTier: NftRewardTier,
): Promise<string> {
  const ipfsNftRewardTier: IPFSNftRewardTier = {
    description: rewardTier.description,
    name: rewardTier.name,
    externalLink: rewardTier.externalLink,
    symbol: undefined,
    image: rewardTier.imageUrl,
    imageDataUrl: undefined,
    artifactUri: undefined,
    animationUri: undefined,
    displayUri: undefined,
    youtubeUri: undefined,
    backgroundColor: undefined,
    attributes: [
      {
        trait_type: 'Min. Contribution',
        value: rewardTier.contributionFloor,
      },
      {
        trait_type: 'Max. Supply',
        value: rewardTier.maxSupply,
      },
    ],
  }

  const res = await axios.post<{ IpfsHash: string }>('/api/ipfs/pin', {
    data: ipfsNftRewardTier,
    options: {
      pinataMetadata: {
        keyvalues: {
          tag: IPFS_TAGS.NFT_REWARDS,
        },
        name: `nft-rewards_${ipfsNftRewardTier.name}`,
      },
    },
  })

  return res.data.IpfsHash
}

// Uploads each nft reward tier to an individual location on IPFS
// returns an array of CIDs which point to each rewardTier on IPFS
export async function uploadNftRewardsToIPFS(
  nftRewards: NftRewardTier[],
): Promise<string[]> {
  return await Promise.all(
    nftRewards.map(rewardTier => uploadNftRewardToIPFS(rewardTier)),
  )
}

export async function uploadNftCollectionMetadataToIPFS({
  collectionName,
  collectionDescription,
  collectionLogoUri,
  collectionInfoUri,
}: {
  collectionName: string
  collectionDescription: string
  collectionLogoUri: string | undefined
  collectionInfoUri: string | undefined
}) {
  // TODO: add inputs for the rest of these fields
  const ipfsNftCollectionMetadata: IpfsNftCollectionMetadata = {
    name: collectionName,
    description: collectionDescription,
    image: collectionLogoUri?.length
      ? collectionLogoUri
      : juiceboxEmojiImageUri,
    seller_fee_basis_points: undefined,
    external_link: collectionInfoUri?.length
      ? collectionInfoUri
      : 'https://juicebox.money',
    fee_recipient: undefined,
  }
  const res = await axios.post<{ IpfsHash: string }>('/api/ipfs/pin', {
    data: ipfsNftCollectionMetadata,
    options: {
      pinataMetadata: {
        keyvalues: {
          tag: IPFS_TAGS.NFT_REWARDS_COLLECTION_METADATA,
        },
        name: collectionName,
      },
    },
  })
  return res.data.IpfsHash
}

// Determines if two NFT reward tiers are equal
export function tiersEqual({
  tier1,
  tier2,
}: {
  tier1: NftRewardTier
  tier2: NftRewardTier
}) {
  return (
    tier1.contributionFloor === tier2.contributionFloor &&
    tier1.description === tier2.description &&
    tier1.externalLink === tier2.externalLink &&
    tier1.imageUrl === tier2.imageUrl &&
    tier1.maxSupply === tier2.maxSupply &&
    tier1.name === tier2.name
  )
}

// Builds JB721TierParams[] (see juice-721-delegate:structs/JB721TierParams.sol)
export function buildJB721TierParams({
  cids,
  rewardTiers,
}: {
  cids: string[]
  rewardTiers: NftRewardTier[]
}): JB721TierParams[] {
  // `cids` are ordered the same as `rewardTiers` so can get corresponding values from same index
  return cids.map((cid, index) => {
    const contributionFloorWei = parseEther(
      rewardTiers[index].contributionFloor.toString(),
    )
    const maxSupply = rewardTiers[index].maxSupply
    const initialQuantity = BigNumber.from(maxSupply ?? DEFAULT_NFT_MAX_SUPPLY)
    const encodedIPFSUri = encodeIPFSUri(cid)

    return {
      contributionFloor: contributionFloorWei,
      lockedUntil: BigNumber.from(0),
      initialQuantity,
      votingUnits: 0,
      reservedRate: 0,
      reservedTokenBeneficiary: constants.AddressZero,
      encodedIPFSUri,
      allowManualMint: false,
      shouldUseBeneficiaryAsDefault: false,
      transfersPausable: false,
    } as JB721TierParams
  })
}

/**
 * Assume that any project with a data source has "NFT Rewards"
 * In other words, uses the JB721Delegate.
 *
 * @TODO this is a TERRIBLE assumption. If someone starts using a different datasource,
 * the UI will break badly. We should probably be validating that the datasource address adheres to a particular interface.ƒ
 */
export function hasNftRewards(
  fundingCycleMetadata: V2V3FundingCycleMetadata | undefined,
) {
  return Boolean(
    fundingCycleMetadata?.dataSource &&
      fundingCycleMetadata.dataSource !== constants.AddressZero &&
      fundingCycleMetadata?.useDataSourceForPay,
  )
}

export function encodeJB721DelegatePayMetadata(
  metadata: JB721DelegatePayMetadata | undefined,
) {
  if (!metadata) return undefined

  const args = [
    constants.HashZero,
    constants.HashZero,
    IJB721Delegate_INTERFACE_ID,
    metadata.dontMint ?? false,
    metadata.expectMintFromExtraFunds ?? false,
    metadata.dontOverspend ?? false,
    metadata.tierIdsToMint,
  ]

  const encoded = defaultAbiCoder.encode(
    ['bytes32', 'bytes32', 'bytes4', 'bool', 'bool', 'bool', 'uint16[]'],
    args,
  )

  return encoded
}

// returns list of tier Ids from a given list of indices of a given list of rewardTiers
export function tierIdsFromTierIndices({
  rewardTiers,
  indices,
}: {
  rewardTiers: NftRewardTier[]
  indices: number[]
}): number[] {
  return rewardTiers
    .map((tier, idx) => {
      if (indices.includes(idx)) {
        return tier.id
      }
    })
    .filter(Number) as number[]
}

export function sumTierFloors(rewardTiers: NftRewardTier[]) {
  return rewardTiers.reduce(
    (subSum, tier) => subSum + tier.contributionFloor,
    0,
  )
}
