import { readNetwork } from 'constants/networks'
import { BigNumber } from 'ethers'
import { useCallback } from 'react'
import { useSwitchNetwork } from 'wagmi'

export function useChangeNetworks() {
  const { chains, switchNetwork } = useSwitchNetwork()

  const changeNetworks = useCallback(async () => {
    const chain = chains.find(c => BigNumber.from(c.id).eq(readNetwork.chainId))

    if (!chain) {
      console.error('FATAL: Chain not found')
      throw new Error('FATAL: Chain not found')
    }
    return switchNetwork?.(chain.id)
  }, [chains, switchNetwork])

  return changeNetworks
}
