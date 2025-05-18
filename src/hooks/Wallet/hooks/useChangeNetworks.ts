import { useSetChain } from '@web3-onboard/react'
import { readNetwork } from 'constants/networks'
import { useCallback } from 'react'
import { useSwitchChain } from 'wagmi'
import { useChain } from './useChain'

/**
 * Attempts to sync the user wallet's chain with the readNetwork (hard-coded per environment)
 * @returns function to sync the user wallet's chain with the readNetwork
 */
export function useChangeNetworks() {
  const [{ chains }, setChain] = useSetChain()
  const { switchChain } = useSwitchChain()
  const x = useChain()
  // console.log(x)

  const changeNetworks = useCallback(
    async (chainId?: number) => {
      // should be JBChainId
      const chain = chains.find(
        c => Number(c.id) === (chainId ?? readNetwork.chainId),
      )
      if (!chain) {
        console.error('FATAL: Chain not found')
        throw new Error('FATAL: Chain not found')
      }

      await setChain({
        chainId: chain.id,
        chainNamespace: chain.namespace,
      })

      // switch network on wagmi too. this hopefully ensures wagmi's internal state is in sync with the wallet
      await switchChain?.({ chainId: parseInt(chain.id) })
    },
    [chains, setChain, switchChain],
  )

  return changeNetworks
}
