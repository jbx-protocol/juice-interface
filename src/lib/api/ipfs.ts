import { PinataMetadata, PinataPinResponse } from '@pinata/sdk'
import axios from 'axios'
import { IPFS_TAGS } from 'constants/ipfs'
import { consolidateMetadata, ProjectMetadataV6 } from 'models/projectMetadata'
import { metadataNameForHandle, restrictedIpfsUrl } from 'utils/ipfs'

// Workaround function for a bug in pinata where the data is sometimes returned in bytes
const extractJsonFromBase64Data = (base64: string) => {
  // Decode base64 in web
  let decoded
  if (typeof window === 'undefined') {
    decoded = Buffer.from(base64, 'base64').toString()
  } else {
    decoded = atob(base64)
  }

  const jsonStart = decoded.indexOf('{')
  const jsonEnd = decoded.lastIndexOf('}')
  return JSON.parse(decoded.substring(jsonStart, jsonEnd + 1))
}

export const isWalletRegistered = async (
  walletAddress: string,
): Promise<boolean> => {
  try {
    const result = await axios.post('/api/ipfs/isWalletRegistered', {
      walletAddress,
    })
    return result.data.registered
  } catch (e) {
    console.error('error occurred', e)
    throw e
  }
}

export const registerWallet = async (
  walletAddress: string,
  signature: string,
  nonce: string,
): Promise<{ apiKey: string; apiSecret: string }> => {
  try {
    const result = await axios.post('/api/ipfs/registerWallet', {
      walletAddress,
      signature,
      nonce,
    })
    return result.data
  } catch (e) {
    console.error('error occurred', e)
    throw e
  }
}

/**
 * Alternative call to `registerWallet` to be used when `IPFS_REQUIRES_KEY_REGISTRATION` is false.
 */
export const clientRegister = async (): Promise<{
  apiKey: string
  apiSecret: string
}> => {
  try {
    const result = await axios.post('/api/ipfs/clientRegister')
    return result.data
  } catch (e) {
    console.error('error occurred', e)
    throw e
  }
}

// TODO: Move to wallet key
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
export const ipfsGetWithFallback = async <T>(
  hash: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  { fallbackHostname }: { fallbackHostname?: string } = {},
) => {
  // Build config for axios get request
  const response = await axios.get<T>(restrictedIpfsUrl(hash), {
    responseType: 'json',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if ((response.data as any).Data?.['/'].bytes) {
    response.data = extractJsonFromBase64Data(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (response.data as any).Data['/'].bytes,
    )
  }
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

export const uploadProjectMetadata = async (
  metadata: Omit<ProjectMetadataV6, 'version'>,
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
