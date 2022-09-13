import {
  PinataMetadata,
  PinataPinListResponse,
  PinataPinResponse,
} from '@pinata/sdk'

import { base58 } from 'ethers/lib/utils'
import {
  IpfsNftCollectionMetadata,
  IPFSNftRewardTier,
  NftRewardTier,
} from 'models/nftRewardTier'
import { consolidateMetadata, ProjectMetadataV4 } from 'models/project-metadata'

import axios from 'axios'

import { juiceboxEmojiImageUri } from 'constants/images'
import { DEFAULT_PINATA_GATEWAY, IPFS_GATEWAY_HOSTNAME } from 'constants/ipfs'

// NOTE: `cid` and `IPFS hash` are synonymous

export const IPFS_TAGS = {
  METADATA:
    process.env.NODE_ENV === 'production'
      ? 'juicebox_project_metadata'
      : 'DEV_juicebox_project_metadata',
  LOGO:
    process.env.NODE_ENV === 'production'
      ? 'juicebox_project_logo'
      : 'DEV_juicebox_project_logo',
  NFT_REWARDS:
    process.env.NODE_ENV === 'production'
      ? 'juicebox_nft_reward_tier'
      : 'DEV_juicebox_nft_reward_tier',
  NFT_REWARDS_COLLECTION_METADATA:
    process.env.NODE_ENV === 'production'
      ? 'juicebox_nft_reward_tier_collection'
      : 'DEV_juicebox_nft_reward_tier_collectionr',
}

// keyvalues will be upserted to existing metadata. A null value will remove an existing keyvalue
export const editMetadataForCid = async (
  cid: string | undefined,
  options?: PinataMetadata,
) => {
  if (!cid) return undefined

  const pinRes = await axios.put(`/api/ipfs/pin/${cid}`, { ...options })

  return pinRes.data
}

export const logoNameForHandle = (handle: string) => `juicebox-@${handle}-logo`

export const metadataNameForHandle = (handle: string) =>
  `juicebox-@${handle}-metadata`

export const ipfsCidUrl = (
  hash: string,
  options: {
    useFallback?: boolean
  } = { useFallback: false },
): string => {
  const { useFallback } = options
  if (useFallback) {
    return `https://${DEFAULT_PINATA_GATEWAY}/ipfs/${hash}`
  }
  return `https://${IPFS_GATEWAY_HOSTNAME}/ipfs/${hash}`
}

export const cidFromUrl = (url: string | undefined) => url?.split('/').pop()

export const ipfsGetWithFallback = async (hash: string) => {
  try {
    const response = await axios.get(ipfsCidUrl(hash))
    return response
  } catch (error) {
    console.info(`ipfs::falling back to public gateway for ${hash}`)
    const response = await axios.get(ipfsCidUrl(hash, { useFallback: true }))
    return response
  }
}

export const pinFileToIpfs = async (
  file: File | Blob | string,
  metadata?: PinataMetadata,
) => {
  const data = new FormData()

  data.append('file', file)

  if (metadata) {
    data.append(
      'pinataMetadata',
      JSON.stringify({
        keyvalues: metadata,
      }),
    )
  }

  const res = await axios.post('/api/ipfs/logo', data, {
    maxContentLength: Infinity, //this is needed to prevent axios from erroring out with large files
    headers: {
      'Content-Type': `multipart/form-data;`,
    },
  })

  return res.data as PinataPinResponse
}

export const uploadProjectMetadata = async (
  metadata: Omit<ProjectMetadataV4, 'version'>,
  handle?: string,
) => {
  const res = await axios.post('/api/ipfs/pin', {
    data: consolidateMetadata(metadata),
    options: {
      pinataMetadata: {
        keyvalues: {
          tag: IPFS_TAGS.METADATA,
        } as any, // eslint-disable-line @typescript-eslint/no-explicit-any
        name: handle
          ? metadataNameForHandle(handle)
          : 'juicebox-project-metadata.json',
      },
    },
  })

  return res.data as PinataPinResponse
}

export const getPinnedListByTag = async (tag: keyof typeof IPFS_TAGS) => {
  const data = await axios.get(`/api/ipfs/pin?tag=${IPFS_TAGS[tag]}`)

  return data.data as PinataPinListResponse
}

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

// returns a native IPFS link (`ipfs://cid`) as a https link
export function formatIpfsLink(ipfsLink: string) {
  const ipfsLinkParts = ipfsLink.split('/')
  const cid = ipfsLinkParts[ipfsLinkParts.length - 1]
  return `https://${DEFAULT_PINATA_GATEWAY}/ipfs/${cid}`
}

// How IPFS URI's are stored in the contracts to save storage (/gas)
export function encodeIPFSUri(cid: string) {
  return '0x' + Buffer.from(base58.decode(cid).slice(2)).toString('hex')
}

export function decodeEncodedIPFSUri(hex: string) {
  // Add default ipfs values for first 2 bytes:
  // - function:0x12=sha2, size:0x20=256 bits
  // - also cut off leading "0x"
  const hashHex = '1220' + hex.slice(2)
  const hashBytes = Buffer.from(hashHex, 'hex')
  const hashStr = base58.encode(hashBytes)
  return hashStr
}
