import pinataClient, { PinataMetadata } from '@pinata/sdk'
import axios from 'axios'

const PINATA_PINNER_KEY = process.env.PINATA_PINNER_KEY
const PINATA_PINNER_SECRET = process.env.PINATA_PINNER_SECRET

export interface UploadFormData {
  file: File
  pinataMetadata: PinataMetadata
}

export const getPinata = () => {
  if (!PINATA_PINNER_KEY) {
    throw new Error('PINATA_PINNER_KEY is not set')
  }

  if (!PINATA_PINNER_SECRET) {
    throw new Error('PINATA_PINNER_SECRET is not set')
  }

  return pinataClient(PINATA_PINNER_KEY, PINATA_PINNER_SECRET)
}

export const pinFileToIpfs = (form: UploadFormData) => {
  // We use axios here because using `pinata.pinFileToIPFS()` leads to this issue: https://github.com/PinataCloud/Pinata-SDK/issues/84
  return axios
    .post('https://api.pinata.cloud/pinning/pinFileToIPFS', form, {
      maxContentLength: Infinity, //this is needed to prevent axios from erroring out with large files
      headers: {
        'Content-Type': `multipart/form-data;`,
        PINATA_PINNER_KEY,
        PINATA_PINNER_SECRET,
      },
    })
    .then(res => res.data)
}

export const getPinnedListByTag = (tag: string) => {
  const pinata = getPinata()
  return pinata.pinList({
    pageLimit: 1000,
    status: 'pinned',
    metadata: {
      keyvalues: {
        tag: {
          value: tag,
          op: 'eq',
        },
      },
    },
  })
}
