import { useSetChain } from '@web3-onboard/react'
import { readNetwork } from 'constants/networks'
import { useCallback } from 'react'

/**
 * Attempts to sync the user wallet's chain with the readNetwork (hard-coded per environment)
 * @returns function to sync the user wallet's chain with the readNetwork
 */
export function useChangeNetworks() {
  const [{ chains }, setChain] = useSetChain()

  const changeNetworks = useCallback(async (chainId?: number) => { // should be JBChainId
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
