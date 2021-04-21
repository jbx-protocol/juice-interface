import { JsonRpcProvider } from '@ethersproject/providers'
import { NETWORKS_BY_NAME } from 'constants/networks'
import { NetworkName } from 'models/network-name'
import { useMemo } from 'react'

export const mainnetProvider = new JsonRpcProvider(
  'https://mainnet.infura.io/v3/' + process.env.REACT_APP_INFURA_ID,
)

const defaultReadNetworkRpcUrl = (process.env.NODE_ENV === 'production'
  ? NETWORKS_BY_NAME.rinkeby
  : NETWORKS_BY_NAME[
      (process.env.REACT_APP_INFURA_DEV_NETWORK as NetworkName) ??
        NetworkName.localhost
    ]
).rpcUrl

export const useReadProvider = (network?: NetworkName) => {
  const url = network
    ? NETWORKS_BY_NAME[network].rpcUrl
    : defaultReadNetworkRpcUrl
  return useMemo(() => new JsonRpcProvider(url), [network])
}
