import pinataClient, { PinataMetadata, PinataPinResponse } from '@pinata/sdk'
import axios from 'axios'
import { IPFS_GATEWAY_HOSTNAME } from 'constants/ipfs'
import { readNetwork } from 'constants/networks'
import { IpfsCacheJsonData } from 'models/ipfs-cache/cache-data'
import { IpfsCacheName } from 'models/ipfs-cache/cache-name'
import { ProjectMetadataV3 } from 'models/project-metadata'

const pinata_api_key = process.env.REACT_APP_PINATA_PINNER_KEY
const pinata_secret_api_key = process.env.REACT_APP_PINATA_PINNER_SECRET

if (!pinata_api_key || !pinata_secret_api_key) {
  throw new Error(
    'Missing .env vars REACT_APP_PINATA_PINNER_KEY or REACT_APP_PINATA_PINNER_SECRET',
  )
}

const pinata = pinataClient(pinata_api_key, pinata_secret_api_key)

export const IPFS_TAGS = {
  [IpfsCacheName.trending]:
    (process.env.NODE_ENV === 'production'
      ? 'trending_projects_'
      : 'DEV_trending_projects_') + readNetwork.name,
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
  let data = new FormData()

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
    ? pinata
        .unpin(cid)
        .then(() => true)
        .catch(err => {
          console.error('Failed to unpin file ', cid, err)
          return false
        })
    : Promise.resolve(false)

export const uploadProjectMetadata = (
  metadata: Omit<ProjectMetadataV3, 'version'>,
  handle: string,
) =>
  pinata.pinJSONToIPFS(
    {
      ...metadata,
      version: 3,
    },
    {
      pinataMetadata: {
        keyvalues: {
          tag: IPFS_TAGS.METADATA,
        } as any,
        name: metadataNameForHandle(handle),
      },
    },
  )

export const uploadIpfsJsonCache = <T extends IpfsCacheName>(
  tag: T,
  data: IpfsCacheJsonData[T],
) =>
  pinata.pinJSONToIPFS(data, {
    pinataMetadata: {
      keyvalues: {
        tag: IPFS_TAGS[tag],
      } as any,
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
