import { PinataPinResponse } from '@pinata/sdk'
import axios from 'axios'
import { consolidateMetadata, ProjectMetadataV6 } from 'models/projectMetadata'
import { IpfsLogoResponse } from 'pages/api/ipfs/pinImage.page'
import {
  ipfsGatewayUrl,
  ipfsOpenGatewayUrl,
  ipfsRestrictedGatewayUrl,
} from 'utils/ipfs'

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

// TODO after the move to Infura for IPFS, we can probably look at removing this.
export const ipfsGetWithFallback = async <T>(
  hash: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  { fallbackHostname }: { fallbackHostname?: string } = {},
) => {
  try {
    // Build config for axios get request
    const response = await axios.get<T>(ipfsRestrictedGatewayUrl(hash), {
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
  } catch (error) {
    const fallbackUrl = fallbackHostname
      ? ipfsGatewayUrl(hash, fallbackHostname)
      : ipfsOpenGatewayUrl(hash)
    console.info(`ipfs::falling back to open gateway for ${hash}`, fallbackUrl)

    const response = await axios.get(fallbackUrl)
    return response
  }
}

export const pinImage = async (image: File | Blob | string) => {
  const formData = new FormData()
  formData.append('file', image)

  const res = await axios.post('/api/ipfs/pinImage', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

  return res.data as IpfsLogoResponse
}

export const pinData = async (data: unknown) => {
  const res = await axios.post('/api/ipfs/pin', {
    data,
  })

  return res.data as PinataPinResponse
}

export const uploadProjectMetadata = async (
  metadata: Omit<ProjectMetadataV6, 'version'>,
) => {
  return await pinData(consolidateMetadata(metadata))
}
