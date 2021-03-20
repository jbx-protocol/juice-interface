import { JsonRpcProvider } from '@ethersproject/providers'
import { NetworkName } from 'models/network-name'

import { NETWORKS_BY_NAME } from './networks'

const defaultNetworkRpcUrl = (process.env.NODE_ENV === 'production'
  ? NETWORKS_BY_NAME.mainnet
  : NETWORKS_BY_NAME[
      (process.env.REACT_APP_INFURA_DEV_NETWORK as NetworkName) ??
        NetworkName.localhost
    ]
).rpcUrl

export const readProvider = (network: NetworkName | undefined) => {
  const url = network ? NETWORKS_BY_NAME[network].rpcUrl : defaultNetworkRpcUrl
  return new JsonRpcProvider(url)
}
