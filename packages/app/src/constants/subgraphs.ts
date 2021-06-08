import { NetworkName } from 'models/network-name'

const baseUrl = 'https://api.thegraph.com'
const path = 'subgraphs/name'
const username = 'peripheralist'
const publicNetUrl = `${baseUrl}/${path}/${username}`

// https://thegraph.com/docs/querying
export const SUBGRAPHS: Partial<Record<NetworkName, string>> = {
  [NetworkName.localhost]: `http://localhost:8000/${path}/juice-local`,
  [NetworkName.rinkeby]: `${publicNetUrl}/juice-rinkeby`,
  [NetworkName.kovan]: `${publicNetUrl}/juice-kovan`,
}
