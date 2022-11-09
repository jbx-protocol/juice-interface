import axios from 'axios'
// import { OPEN_IPFS_GATEWAY_HOSTNAME } from 'constants/ipfs'

const INFURA_IPFS_PROJECT_ID = process.env.NEXT_PUBLIC_INFURA_IPFS_PROJECT_ID
const INFURA_IPFS_API_SECRET = process.env.NEXT_PUBLIC_INFURA_IPFS_API_SECRET

const axiosInstance = axios.create({
  // baseURL: OPEN_IPFS_GATEWAY_HOSTNAME,
  headers: {
    Authorization:
      'Basic ' +
      Buffer.from(
        `${INFURA_IPFS_PROJECT_ID}:${INFURA_IPFS_API_SECRET}`,
      ).toString('base64'),
  },
})

export function ipfsGet(url: string) {
  return axiosInstance.get(url)
}
