import axios, { AxiosRequestConfig } from 'axios'
import { consolidateMetadata, ProjectMetadataV6 } from 'models/projectMetadata'
import { ipfsGatewayUrl } from 'utils/ipfs'

interface IpfsPinFileResponse {
  IpfsHash: string
}

export const pinataApi = axios.create({
  baseURL: 'https://api.pinata.cloud',
  headers: {
    Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJlZTcwZjUzNC0xOGU3LTQxMjEtYjdhZS1iZjEyYjZlZmFmMjgiLCJlbWFpbCI6InBlcmlwaGVyYWxpc3RAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siaWQiOiJOWUMxIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6IjYxZTRkYTNlOGJlODdlNGM4NmNjIiwic2NvcGVkS2V5U2VjcmV0IjoiOGRkMTIyYTkyYzI3NGYwMGVjOTE2N2I0N2U2OTljMTQ2MWUxMGYwYTU0ZWY4MmUwOTI3YThiYWY1NTBkYjhhNyIsImlhdCI6MTY3NzAyNjEyMH0.RsMakKsm6OJUM4xzMpX1eqfgJ8TXTS1Bflsd8XMKfTg`,
    'x-pinata-gateway-token':
      'L4sAB0Yj5qw00JRpvydkYNsHC0hIv2xzW_4sGFoWureRhBMH4G5vPJZUwvamDlW8',
  },
})

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

export const ipfsGet = async <T>(
  hash: string,
  opts?: AxiosRequestConfig<T>,
) => {
  // Build config for axios get request
  const response = await axios.get<T>(ipfsGatewayUrl(hash), {
    ...opts,
    responseType: 'json',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(opts?.headers ?? {}),
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
}

export const pinFile = async (
  image: File | Blob | string,
  onProgress?: (e: any) => void, // eslint-disable-line @typescript-eslint/no-explicit-any
) => {
  const formData = new FormData()
  formData.append('file', image)
  const res = await pinataApi.post<IpfsPinFileResponse>(
    '/pinning/pinFileToIPFS',
    formData,
    {
      maxBodyLength: Infinity,
      headers: {
        'Content-Type': `multipart/form-data`,
      },
      onUploadProgress(e) {
        onProgress?.(e)
      },
    },
  )

  return res.data
}

export const pinJson = async (data: unknown) => {
  const res = await pinataApi.post<IpfsPinFileResponse>(
    'pinning/pinJSONToIPFS',
    data,
  )

  return res.data
}

export const uploadProjectMetadata = async (
  metadata: Omit<ProjectMetadataV6, 'version'>,
) => {
  return await pinJson(consolidateMetadata(metadata))
}
