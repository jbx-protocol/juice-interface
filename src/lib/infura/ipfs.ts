import axios from 'axios'
import { INFURA_IPFS_API_BASE_URL } from 'constants/ipfs'
import { readNetwork } from 'constants/networks'
import { NetworkName } from 'models/network-name'

const INFURA_IPFS_PROJECT_ID = process.env.INFURA_IPFS_PROJECT_ID
const INFURA_IPFS_API_SECRET = process.env.INFURA_IPFS_API_SECRET

const AUTH_HEADER = `Basic ${Buffer.from(
  `${INFURA_IPFS_PROJECT_ID}:${INFURA_IPFS_API_SECRET}`,
).toString('base64')}`

const DEV_ORIGIN = 'http://localhost:3000'
const GOERLI_ORIGIN = 'http://goerli.juicebox.money'
const MAINNET_ORIGIN = 'https://juicebox.money'

const origin =
  process.env.NODE_ENV === 'development'
    ? DEV_ORIGIN
    : readNetwork.name === NetworkName.goerli
    ? GOERLI_ORIGIN
    : MAINNET_ORIGIN

const infuraApi = axios.create({
  baseURL: INFURA_IPFS_API_BASE_URL,
  headers: {
    Authorization: AUTH_HEADER,
    origin,
  },
})

export function pin(hash: string) {
  return infuraApi.post(`/api/v0/pin/add?arg=${hash}`)
}
