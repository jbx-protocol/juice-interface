import { SupportedChainId, readNetwork } from 'constants/networks'

import { useCallback } from 'react'
import { useSetChain } from '@web3-onboard/react'

export function useChangeNetworks() {
  const [{ chains }, setChain] = useSetChain()

  const changeNetworks = useCallback(async (chainId?: SupportedChainId) => {
    const chain = chains.find(c => Number(c.id) === (chainId ?? readNetwork.chainId))
    if (!chain) {
      console.error('FATAL: Chain not found')
      throw new Error('FATAL: Chain not found')
    }

    return await setChain({
      chainId: chain.id,
      chainNamespace: chain.namespace,
    })
  }, [chains, setChain])

  return changeNetworks
}
