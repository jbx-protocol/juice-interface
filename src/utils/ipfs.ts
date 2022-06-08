import pinataClient, { PinataMetadata, PinataPinResponse } from '@pinata/sdk'
import axios from 'axios'

import { IpfsCacheJsonData } from 'models/ipfs-cache/cache-data'
import { IpfsCacheName } from 'models/ipfs-cache/cache-name'
import { consolidateMetadata, ProjectMetadataV4 } from 'models/project-metadata'

import { readNetwork } from 'constants/networks'
import { IPFS_GATEWAY_HOSTNAME } from 'constants/ipfs'

const pinata_api_key = process.env.NEXT_PUBLIC_PINATA_PINNER_KEY
const pinata_secret_api_key = process.env.NEXT_PUBLIC_PINATA_PINNER_SECRET

if (!pinata_api_key || !pinata_secret_api_key) {
  throw new Error(
    'Missing .env vars NEXT_PUBLIC_PINATA_PINNER_KEY or NEXT_PUBLIC_PINATA_PINNER_SECRET',
  )
}

const pinata = pinataClient(pinata_api_key, pinata_secret_api_key)

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
}

// keyvalues will be upserted to existing metadata. A null value will remove an existing keyvalue
export const editMetadataForCid = (
  cid: string | undefined,
  options?: PinataMetadata,
) => (cid ? pinata.hashMetadata(cid, { ...options }) : undefined)

export const logoNameForHandle = (handle: string) => `juicebox-@${handle}-logo`

export const metadataNameForHandle = (handle: string) =>
  `juicebox-@${handle}-metadata`

export const ipfsCidUrl = (hash: string) =>
  `https://${IPFS_GATEWAY_HOSTNAME}/ipfs/${hash}`

export const cidFromUrl = (url: string | undefined) => url?.split('/').pop()

export const pinFileToIpfs = (
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

  // We use axios here because using `pinata.pinFileToIPFS()` leads to this issue: https://github.com/PinataCloud/Pinata-SDK/issues/84
  return axios
    .post('https://api.pinata.cloud/pinning/pinFileToIPFS', data, {
      maxContentLength: Infinity, //this is needed to prevent axios from erroring out with large files
      headers: {
        'Content-Type': `multipart/form-data;`,
        pinata_api_key,
        pinata_secret_api_key,
      },
    })
    .then(res => res.data as PinataPinResponse)
}

export const unpinIpfsFileByCid = (cid: string | undefined) =>
  cid
    ? pinata.unpin(cid).catch(err => {
        console.error('Failed to unpin file ', cid, err)
      })
    : Promise.reject()

export const uploadProjectMetadata = (
  metadata: Omit<ProjectMetadataV4, 'version'>,
  handle?: string,
) =>
  pinata.pinJSONToIPFS(consolidateMetadata(metadata), {
    pinataMetadata: {
      keyvalues: {
        tag: IPFS_TAGS.METADATA,
      } as any, // eslint-disable-line @typescript-eslint/no-explicit-any
      name: handle
        ? metadataNameForHandle(handle)
        : 'juicebox-project-metadata.json',
    },
  })

export const uploadIpfsJsonCache = <T extends IpfsCacheName>(
  tag: T,
  data: IpfsCacheJsonData[T],
) =>
  pinata.pinJSONToIPFS(data, {
    pinataMetadata: {
      keyvalues: {
        tag: IPFS_TAGS[tag],
      } as any, // eslint-disable-line @typescript-eslint/no-explicit-any
      name: IPFS_TAGS[tag] + '.json',
    },
  })

export const getPinnedListByTag = (tag: keyof typeof IPFS_TAGS) =>
  pinata.pinList({
    pageLimit: 1000,
    status: 'pinned',
    metadata: {
      keyvalues: {
        tag: {
          value: IPFS_TAGS[tag],
          op: 'eq',
        },
      },
    },
  })
