import { notification } from 'antd'
import Axios, { AxiosResponse } from 'axios'

import { ProjectMetadataV3 } from 'models/project-metadata'

import { IPFS_GATEWAY_HOSTNAME } from 'constants/ipfs'

const pinata_api_key = process.env.REACT_APP_PINATA_PINNER_KEY
const pinata_secret_api_key = process.env.REACT_APP_PINATA_PINNER_SECRET

type IpfsCallOptions = {
  metadata?: Record<string, any>
  beforeUpload?: VoidFunction
  onSuccess?: (cid: string) => void
  onError?: (err: string) => void
}

type IpfsResponse =
  | {
      success: true
      res: AxiosResponse
      cid: string
      url: string
    }
  | { success: false; err: string }

type IpfsMetadataOperator =
  | 'gt'
  | 'gte'
  | 'lt'
  | 'lte'
  | 'ne'
  | 'eq'
  | 'between'
  | 'secondValue'
  | 'notBetween'
  | 'like'
  | 'notLike'
  | 'iLike'
  | 'notILike'
  | 'regexp'
  | 'iRegexp'

type IpfsMetadataQuery = Record<
  string,
  { value: string | number; op: IpfsMetadataOperator }
>

export const IPFS_TAGS = {
  METADATA:
    process.env.NODE_ENV === 'production'
      ? 'juicebox_project_metadata'
      : 'DEV_juicebox_project_metadata',
  LOGO:
    process.env.NODE_ENV === 'production'
      ? 'juicebox_project_logo'
      : 'DEV_juicebox_project_logo',
}

const formatQueryMetadata = (metadata?: IpfsMetadataQuery) => {
  const query = metadata
    ? Object.keys(metadata).reduce(
        (acc, key) => (acc += `"${key}": ${JSON.stringify(metadata[key])}`),
        '',
      )
    : undefined

  return `?metadata[keyvalues]={${query}}`
}

const formatQueryFilters = (filters?: Record<string, string | number>) =>
  filters
    ? Object.keys(filters).reduce(
        (acc, key, i) => (acc += `${i > 0 ? '&' : ''}${key}=${filters[key]}`),
        '?',
      )
    : ''

const getIpfsPinList = (query: {
  name?: string
  metadata?: IpfsMetadataQuery
  filters?: {
    hashContains?: string
    pinStart?: string
    pinEnd?: string
    unpinStart?: string
    unpinEnd?: string
    pinSizeMin?: number
    pinSizeMax?: number
    status?: 'all' | 'pinned' | 'unpinned'
    pageLimit?: number
    pageOffset?: number
  }
}): Promise<{
  data: {
    count: number
    rows: {
      id: string
      ipfs_pin_hash: string
      size: number
      user_id: string
      date_pinned: string
      date_unpinned: string
      metadata: {
        name: string
        keyvalues: Record<string, string | number>
        regions: {
          regionId: string
          desiredReplicationCount: number
          currentReplicationCount: number
        }[]
      }
    }[]
  }
}> =>
  Axios.get(
    'https://api.pinata.cloud/data/pinList' +
      (query.name ? '?metadata[name]=' + query.name : '') +
      (query.metadata ? formatQueryMetadata(query.metadata) : '') +
      (query.filters ? formatQueryFilters(query.filters) : ''),
    {
      headers: {
        pinata_api_key,
        pinata_secret_api_key,
      },
    },
  )

const getPinnedByName = (name: string) => getIpfsPinList({ name })

// keyvalues will be upserted to existing metadata. A null value will remove an existing keyvalue
export const editMetadataForCid = (
  cid: string | undefined,
  options?: {
    keyvalues?: Record<string, string | number | boolean | object | null>
    name?: string
  },
) =>
  cid
    ? Axios.put(
        'https://api.pinata.cloud/pinning/hashMetadata',
        {
          ipfsPinHash: cid,
          name: options?.name,
          keyvalues: options?.keyvalues,
        },
        {
          headers: {
            pinata_api_key,
            pinata_secret_api_key,
          },
        },
      )
        .then(res => true)
        .catch(err => {
          console.error('Failed to set metadata ', { cid, options }, err)
          return false
        })
    : undefined

export const logoNameForHandle = (handle: string) => `juicebox-@${handle}-logo`

export const metadataNameForHandle = (handle: string) =>
  `juicebox-@${handle}-metadata`

export const metadataNameForProjectId = (id: string) =>
  `juicebox-project-${id}-metadata`

export const ipfsCidUrl = (hash: string) =>
  `https://${IPFS_GATEWAY_HOSTNAME}/ipfs/${hash}`

export const cidFromUrl = (url: string | undefined) => url?.split('/').pop()

export const pinFileToIpfs = (
  file: File | Blob | string,
  options?: IpfsCallOptions,
): Promise<IpfsResponse> => {
  options?.beforeUpload && options.beforeUpload()

  let data = new FormData()

  data.append('file', file)

  if (options?.metadata) {
    data.append(
      'pinataMetadata',
      JSON.stringify({
        keyvalues: options.metadata,
      }),
    )
  }

  return Axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', data, {
    maxContentLength: Infinity, //this is needed to prevent axios from erroring out with large files
    headers: {
      'Content-Type': `multipart/form-data;`,
      pinata_api_key,
      pinata_secret_api_key,
    },
  })
    .then(res => {
      const cid = res.data.IpfsHash as string
      options?.onSuccess && options.onSuccess(cid)
      return {
        success: true as const,
        cid,
        url: ipfsCidUrl(cid),
        res,
      }
    })
    .catch(err => {
      options?.onError && options.onError(err)
      return {
        success: false as const,
        err,
      }
    })
}

export const pinJSONToIpfs = (
  json: Record<string | number, string | number | boolean | object>,
  options?: IpfsCallOptions & { name?: string },
): Promise<IpfsResponse> =>
  Axios.post(
    'https://api.pinata.cloud/pinning/pinJSONToIPFS',
    {
      pinataContent: json,
      ...(options?.metadata || options?.name
        ? {
            pinataMetadata: {
              ...(options?.name ? { name: options.name } : {}),
              ...(options?.metadata ? { keyvalues: options.metadata } : {}),
            },
          }
        : {}),
    },
    {
      headers: {
        pinata_api_key,
        pinata_secret_api_key,
      },
    },
  )
    .then(res => {
      const cid = res.data.IpfsHash
      options?.onSuccess && options.onSuccess(cid)
      return {
        success: true as const,
        cid,
        url: ipfsCidUrl(cid),
        res,
      }
    })
    .catch(err => {
      options?.onError && options.onError(err)
      return {
        success: false as const,
        err,
      }
    })

export const unpinIpfsFileByCid = (cid: string | undefined) =>
  cid
    ? Axios.delete(`https://api.pinata.cloud/pinning/unpin/${cid}`, {
        headers: {
          pinata_api_key,
          pinata_secret_api_key,
        },
      })
        .then(() => true)
        .catch(err => {
          console.error('Failed to unpin file ', cid, err)
          return false
        })
    : Promise.resolve(false)

export const uploadProjectMetadata = (
  metadata: Omit<ProjectMetadataV3, 'version'>,
) =>
  pinJSONToIpfs(
    {
      ...metadata,
      version: 3,
    },
    {
      name: 'juicebox-project-metadata.json',
      metadata: {
        tag: IPFS_TAGS.METADATA,
      },
    },
  ).then(res => {
    if (!res.success) {
      notification.error({
        key: new Date().valueOf().toString(),
        message: 'Failed to upload project metadata',
        description: JSON.stringify(res.err),
        duration: 0,
      })
    }
    return res
  })

export const unpinFileByName = (name: string) =>
  getPinnedByName(name).then(res => {
    if (!res.data.count) {
      console.log('No pinned items found with name', name)
      return
    }

    return unpinIpfsFileByCid(res.data.rows[0].ipfs_pin_hash)
  })
