import { JsonRpcProvider } from '@ethersproject/providers'
import { NETWORKS_BY_NAME } from 'constants/networks'
import { NetworkName } from 'models/network-name'

export const mainnetProvider = new JsonRpcProvider(
  'https://mainnet.infura.io/v3/' + process.env.REACT_APP_INFURA_ID,
)

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
