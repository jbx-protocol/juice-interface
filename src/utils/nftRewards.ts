import axios from 'axios'
import { juiceboxEmojiImageUri } from 'constants/images'
import {
  ContractNftRewardTier,
  IpfsNftCollectionMetadata,
  IPFSNftRewardTier,
  NftRewardTier,
} from 'models/nftRewardTier'
import { V2V3ContractName } from 'models/v2v3/contracts'
import { decodeEncodedIPFSUri, IPFS_TAGS } from 'utils/ipfs'

export const MAX_NFT_REWARD_TIERS = 3

// Following three functions get the latest deployments of the NFT contracts from the NPM package
// TODO: will need to incorporate `networkName` into this first function when contracts deployed to mainnet
async function getLatestNftContractDeployments() {
  const latestNftContractDeployments = await import(
    '@jbx-protocol/juice-nft-rewards/broadcast/Deploy.s.sol/4/run-latest.json'
  )
  return latestNftContractDeployments
}

export async function getLatestNftProjectDeployerContractAddress() {
  const latestNftContractDeployments = await getLatestNftContractDeployments()
  return latestNftContractDeployments.default.transactions.filter(
    tx =>
      tx.contractName === V2V3ContractName.JBTiered721DelegateProjectDeployer,
  )?.[0]?.contractAddress
}

export async function getLatestNftDelegateStoreContractAddress() {
  const latestNftContractDeployments = await getLatestNftContractDeployments()
  return latestNftContractDeployments.default.transactions.filter(
    tx => tx.contractName === V2V3ContractName.JBTiered721DelegateStore,
  )?.[0]?.contractAddress
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
