import { BigNumber } from '@ethersproject/bignumber'
import * as constants from '@ethersproject/constants'
import axios from 'axios'
import { JB721DelegatePayMetadata } from 'components/Project/PayProjectForm/usePayProjectForm'
import { juiceboxEmojiImageUri } from 'constants/images'
import { IPFS_TAGS } from 'constants/ipfs'
import { readNetwork } from 'constants/networks'
import { WAD_DECIMALS } from 'constants/numbers'
import { V2V3_PROJECT_IDS } from 'constants/v2v3/projectIds'
import { defaultAbiCoder, parseEther } from 'ethers/lib/utils'
import { DEFAULT_NFT_MAX_SUPPLY } from 'hooks/NftRewards'
import { round } from 'lodash'
import {
  IpfsNftCollectionMetadata,
  IPFSNftRewardTier,
  JB721GovernanceType,
  JB721PricingParams,
  JB721TierParams,
  JBDeployTiered721DelegateData,
  NftRewardTier,
} from 'models/nftRewardTier'
import { V2V3ContractName } from 'models/v2v3/contracts'
import { decodeEncodedIPFSUri, encodeIPFSUri, ipfsUrl } from 'utils/ipfs'
import { V2V3_CURRENCY_ETH } from './v2v3/currency'

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
  return cids
    .map((cid, index) => {
      const contributionFloorWei = parseEther(
        rewardTiers[index].contributionFloor.toString(),
      )
      const maxSupply = rewardTiers[index].maxSupply
      const initialQuantity = BigNumber.from(
        maxSupply ?? DEFAULT_NFT_MAX_SUPPLY,
      )
      const encodedIPFSUri = encodeIPFSUri(cid)

      return {
        contributionFloor: contributionFloorWei,
        lockedUntil: BigNumber.from(0),
        initialQuantity,
        votingUnits: BigNumber.from(0),
        reservedRate: BigNumber.from(0),
        reservedTokenBeneficiary: constants.AddressZero,
        encodedIPFSUri,
        allowManualMint: false,
        shouldUseBeneficiaryAsDefault: false,
        transfersPausable: false,
      } as JB721TierParams
    })
    .sort((a, b) => {
      // Tiers MUST BE in ascending order when sent to contract.
      if (a.contributionFloor.gt(b.contributionFloor)) return 1
      if (a.contributionFloor.lt(b.contributionFloor)) return -1
      return 0
    })
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

export function encodeJB721DelegateRedeemMetadata(tokenIdsToRedeem: string[]) {
  const args = [
    constants.HashZero,
    IJB721Delegate_INTERFACE_ID,
    tokenIdsToRedeem,
  ]

  const encoded = defaultAbiCoder.encode(
    ['bytes32', 'bytes4', 'uint256[]'],
    args,
  )

  return encoded
}

export function decodeJB721DelegateRedeemMetadata(
  metadata: string,
): [string, string, BigNumber[]] | undefined {
  try {
    const decoded = defaultAbiCoder.decode(
      ['bytes32', 'bytes4', 'uint256[]'],
      metadata,
    ) as [string, string, BigNumber[]]

    return decoded
  } catch (e) {
    return undefined
  }
}

// returns an array of NftRewardTiers corresponding to a given list of tier IDs
//    Note: If ids contains multiple of the same ID, the return value
//          will contain corresponding rewardTier multiple times.
export function rewardTiersFromIds({
  tierIds,
  rewardTiers,
}: {
  tierIds: number[]
  rewardTiers: NftRewardTier[]
}) {
  return tierIds
    .map(id => rewardTiers.find(tier => tier.id === id))
    .filter(tier => Boolean(tier)) as NftRewardTier[]
}

// sums the contribution floors of a given list of nftRewardTiers
//    - optional select only an array of ids
export function sumTierFloors(
  rewardTiers: NftRewardTier[],
  tierIds?: number[],
) {
  if (!tierIds) return 0

  const selectedTiers = rewardTiersFromIds({
    tierIds,
    rewardTiers,
  })

  return round(
    selectedTiers.reduce((subSum, tier) => subSum + tier.contributionFloor, 0),
    6,
  )
}

export function buildJBDeployTiered721DelegateData({
  collectionUri,
  collectionName,
  collectionSymbol,
  tiers,
  ownerAddress,
  contractAddresses: {
    JBDirectoryAddress,
    JBFundingCycleStoreAddress,
    JBPricesAddress,
    JBTiered721DelegateStoreAddress,
  },
}: {
  collectionUri: string
  collectionName: string
  collectionSymbol: string
  tiers: JB721TierParams[]
  ownerAddress: string
  contractAddresses: {
    JBDirectoryAddress: string
    JBFundingCycleStoreAddress: string
    JBPricesAddress: string
    JBTiered721DelegateStoreAddress: string
  }
}): JBDeployTiered721DelegateData {
  const pricing: JB721PricingParams = {
    tiers,
    currency: V2V3_CURRENCY_ETH,
    decimals: WAD_DECIMALS,
    prices: JBPricesAddress,
  }

  return {
    directory: JBDirectoryAddress,
    name: collectionName,
    symbol: collectionSymbol,
    fundingCycleStore: JBFundingCycleStoreAddress,
    baseUri: ipfsUrl(''),
    tokenUriResolver: constants.AddressZero,
    contractUri: ipfsUrl(collectionUri),
    owner: ownerAddress,
    pricing,
    reservedTokenBeneficiary: constants.AddressZero,
    store: JBTiered721DelegateStoreAddress,
    flags: {
      lockReservedTokenChanges: false,
      lockVotingUnitChanges: false,
      lockManualMintingChanges: false,
    },
    governanceType: JB721GovernanceType.TIERED,
  }
}

/**
 * Return some hard-coded metadata overrides for specific projects.
 */
export function payMetadataOverrides(
  projectId: number,
): Omit<JB721DelegatePayMetadata, 'tierIdsToMint'> {
  // ConstitutionDAO2 wanted to _not_ overspend. That is, to not allow any payment amount that
  // doesn't equal one of the NFT tier amounts.
  if (projectId === V2V3_PROJECT_IDS.CDAO2) {
    return { dontOverspend: true }
  }

  return {}
}
