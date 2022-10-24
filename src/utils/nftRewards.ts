import { BigNumber } from '@ethersproject/bignumber'
import * as constants from '@ethersproject/constants'
import axios from 'axios'
import { juiceboxEmojiImageUri } from 'constants/images'
import { readNetwork } from 'constants/networks'
import { MaxUint48 } from 'constants/numbers'
import { parseEther } from 'ethers/lib/utils'
import { TxNftArg } from 'hooks/v2v3/transactor/LaunchProjectWithNftsTx'
import {
  ContractNftRewardTier,
  IpfsNftCollectionMetadata,
  IPFSNftRewardTier,
  NftRewardTier,
} from 'models/nftRewardTier'
import { V2V3ContractName } from 'models/v2v3/contracts'
import { decodeEncodedIPFSUri, encodeIPFSUri, IPFS_TAGS } from 'utils/ipfs'
import { ForgeDeploy } from './v2v3/loadV2V3Contract'

export const MAX_NFT_REWARD_TIERS = 3

// Following three functions get the latest deployments of the NFT contracts from the NPM package
async function loadNftRewardsDeployment() {
  const latestNftContractDeployments = (await import(
    `@jbx-protocol/juice-nft-rewards/broadcast/Deploy.s.sol/${readNetwork.chainId}/run-latest.json`
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
    tx => tx.contractName === V2V3ContractName.JBTiered721DelegateStore,
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
  nftRewardTiersResponse: ContractNftRewardTier[],
): string[] {
  const cids: string[] = nftRewardTiersResponse
    .map((contractRewardTier: ContractNftRewardTier) => {
      return decodeEncodedIPFSUri(contractRewardTier.encodedIPFSUri)
    })
    .filter(cid => cid.length > 0)
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
  const res = await axios.post('/api/ipfs/pin', {
    data: ipfsNftRewardTier,
    options: {
      pinataMetadata: {
        keyvalues: {
          tag: IPFS_TAGS.NFT_REWARDS,
        } as any, // eslint-disable-line @typescript-eslint/no-explicit-any
        name: ipfsNftRewardTier.name,
      },
    },
  })
  return res.data.IpfsHash as string
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
  const res = await axios.post('/api/ipfs/pin', {
    data: ipfsNftCollectionMetadata,
    options: {
      pinataMetadata: {
        keyvalues: {
          tag: IPFS_TAGS.NFT_REWARDS_COLLECTION_METADATA,
        } as any, // eslint-disable-line @typescript-eslint/no-explicit-any
        name: collectionName,
      },
    },
  })
  return res.data.IpfsHash as string
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

// converts txNftArg[] into JB721TierParams[] (see juice-nft-rewards:structs/JB721TierParams.sol)
export function buildJB721TierParams(nftRewards: TxNftArg) {
  return Object.keys(nftRewards).map(cid => {
    const contributionFloorWei = parseEther(
      nftRewards[cid].contributionFloor.toString(),
    )
    const maxSupply = nftRewards[cid].maxSupply
    const initialQuantity = maxSupply ?? MaxUint48
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
    }
  })
}

// returns util arg send to nft Tx's
export function buildNftTxArg({
  cids,
  rewardTiers,
}: {
  cids: string[]
  rewardTiers: NftRewardTier[] | undefined
}): TxNftArg {
  return cids.reduce(
    (acc, cid, idx) => ({
      ...acc,
      [cid]: rewardTiers?.[idx] ?? undefined,
    }),
    {},
  )
}
