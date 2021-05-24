import { JsonRpcProvider } from '@ethersproject/providers'
import { defaultReadNetworkRpcUrl, NETWORKS_BY_NAME } from 'constants/networks'
import { useContext, useMemo } from 'react'

import { NetworkContext } from '../contexts/networkContext'

export const useReadProvider = () => {
  const { signerNetwork } = useContext(NetworkContext)

  const url = signerNetwork
    ? NETWORKS_BY_NAME[signerNetwork].rpcUrl
    : defaultReadNetworkRpcUrl

  return useMemo(() => new JsonRpcProvider(url), [url])
}
