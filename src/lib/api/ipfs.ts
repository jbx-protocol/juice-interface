import { PinataMetadata, PinataPinResponse } from '@pinata/sdk'
import axios from 'axios'
import { IPFS_TAGS } from 'constants/ipfs'
import { consolidateMetadata, ProjectMetadataV5 } from 'models/project-metadata'
import { metadataNameForHandle, restrictedIpfsUrl } from 'utils/ipfs'

// keyvalues will be upserted to existing metadata. A null value will remove an existing keyvalue
export const editMetadataForCid = async (
  cid: string | undefined,
  options?: PinataMetadata,
) => {
  if (!cid) return undefined

  const pinRes = await axios.put(`/api/ipfs/pin/${cid}`, { ...options })

  return pinRes.data
}

// TODO after the move to Infura for IPFS, we can probably look at removing this.
export const ipfsGetWithFallback = async (
  hash: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  { fallbackHostname }: { fallbackHostname?: string } = {},
) => {
  // try {
  // Build config for axios get request
  const response = await axios({
    method: 'get',
    url: restrictedIpfsUrl(hash),
    responseType: 'json',
    headers: {
      Accept: 'application/json, text/plain',
      'Content-Type': 'application/json',
    },
  })
  return response
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // } catch (error: any) {
  //   if (error?.response?.status === 400) throw error
  //   console.info(`ipfs::falling back to open gateway for ${hash}`)
  //   const response = fallbackHostname
  //     ? await axios.get(ipfsGatewayUrl(hash, fallbackHostname))
  //     : await axios.get(openIpfsUrl(hash))
  //   return response
  // }
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
  metadata: Omit<ProjectMetadataV5, 'version'>,
  handle?: string,
) => {
  const res = await axios.post('/api/ipfs/pin', {
    data: consolidateMetadata(metadata),
    options: {
      pinataMetadata: {
        keyvalues: {
          tag: IPFS_TAGS.METADATA,
        },
        name: handle
          ? metadataNameForHandle(handle)
          : 'juicebox-project-metadata.json',
      },
    },
  })

  return res.data as PinataPinResponse
}
