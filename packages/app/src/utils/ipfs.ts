import Axios, { AxiosResponse } from 'axios'
import { ProjectMetadata } from 'models/project-metadata'
import { ProjectIdentifier } from 'models/project-identifier'

export const uploadFile = (
  file: File | Blob | string,
  options?: {
    metadata?: Record<string, any>
    beforeUpload?: VoidFunction
    onSuccess?: (cid: string) => void
    onError?: (err: string) => void
  },
): Promise<{
  success: boolean
  res?: AxiosResponse
  err?: string
  cid?: string
}> => {
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
      pinata_api_key: process.env.REACT_APP_PINATA_PINNER_KEY,
      pinata_secret_api_key: process.env.REACT_APP_PINATA_PINNER_SECRET,
    },
  })
    .then(res => {
      const cid = res.data.IpfsHash
      options?.onSuccess && options.onSuccess(cid)
      return {
        success: true,
        cid,
        res,
      }
    })
    .catch(err => {
      options?.onError && options.onError(err)
      return {
        success: false,
        err,
      }
    })
}

export const ipfsCidUrl = (hash: string | undefined) =>
  hash ? 'https://gateway.pinata.cloud/ipfs/' + hash : undefined

export const IPFS_TAGS = {
  METADATA: 'juice_project_metadata',
  LOGO: 'juice_project_logo',
}
