import { JsonRpcProvider } from '@ethersproject/providers'

import { NetworkName } from 'models/network-name'
import { NETWORKS } from './networks'

const defaultNetworkRpcUrl = (process.env.NODE_ENV === 'production'
  ? NETWORKS.mainnet
  : NETWORKS.localhost
).rpcUrl

export const readProvider = (network: NetworkName | undefined) =>
  new JsonRpcProvider(network ? NETWORKS[network].rpcUrl : defaultNetworkRpcUrl)
