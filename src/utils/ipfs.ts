import {
  PinataMetadata,
  PinataPinListResponse,
  PinataPinResponse,
} from '@pinata/sdk'

import { IpfsCacheJsonData } from 'models/ipfs-cache/cache-data'
import { IpfsCacheName } from 'models/ipfs-cache/cache-name'
import { consolidateMetadata, ProjectMetadataV4 } from 'models/project-metadata'
import { NftRewardTier } from 'models/v2/nftRewardTier'

import axios from 'axios'

import { readNetwork } from 'constants/networks'
import { IPFS_GATEWAY_HOSTNAME } from 'constants/ipfs'

export const IPFS_TAGS = {
  [IpfsCacheName.trending]:
    (process.env.NODE_ENV === 'production'
      ? 'trending_projects_'
      : 'DEV_trending_projects_') + readNetwork.name,
  [IpfsCacheName.trendingV2]:
    (process.env.NODE_ENV === 'production'
      ? 'trending_projects_v2_'
      : 'DEV_trending_projects_v2_') + readNetwork.name,
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
}

// keyvalues will be upserted to existing metadata. A null value will remove an existing keyvalue
export const editMetadataForCid = async (
  cid: string | undefined,
  options?: PinataMetadata,
) => {
  if (!cid) return undefined

  const pinRes = await axios.put(`/ipfs/pin/${cid}`, { ...options })

  return pinRes.data
}

export const logoNameForHandle = (handle: string) => `juicebox-@${handle}-logo`

export const metadataNameForHandle = (handle: string) =>
  `juicebox-@${handle}-metadata`

export const ipfsCidUrl = (hash: string) =>
  `https://${IPFS_GATEWAY_HOSTNAME}/ipfs/${hash}`

export const cidFromUrl = (url: string | undefined) => url?.split('/').pop()

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

  const res = await axios.post('/ipfs/logo', data)

  return res.data as PinataPinResponse
}

export const uploadProjectMetadata = async (
  metadata: Omit<ProjectMetadataV4, 'version'>,
  handle?: string,
) => {
  const res = await axios.post('/ipfs/pin', {
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

export const uploadIpfsJsonCache = async <T extends IpfsCacheName>(
  tag: T,
  data: IpfsCacheJsonData[T],
) => {
  return await axios.post('/ipfs/pin', {
    data,
    options: {
      pinataMetadata: {
        keyvalues: {
          tag: IPFS_TAGS[tag],
        } as any, // eslint-disable-line @typescript-eslint/no-explicit-any
        name: IPFS_TAGS[tag] + '.json',
      },
    },
  })
}

export const getPinnedListByTag = async (tag: keyof typeof IPFS_TAGS) => {
  const data = await axios.get(`/ipfs/pin?tag=${IPFS_TAGS[tag]}`)

  return data.data as PinataPinListResponse
}

async function uploadNftRewardToIPFS(
  rewardTier: NftRewardTier,
): Promise<string> {
  const res = await axios.post('/ipfs/pin', {
    data: rewardTier,
    options: {
      pinataMetadata: {
        keyvalues: {
          tag: IPFS_TAGS.NFT_REWARDS,
        } as any, // eslint-disable-line @typescript-eslint/no-explicit-any
        name: rewardTier.name,
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
