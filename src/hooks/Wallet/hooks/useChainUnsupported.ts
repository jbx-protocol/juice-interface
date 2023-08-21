import { readNetwork } from 'constants/networks'
import { BigNumber } from 'ethers'
import { useMemo } from 'react'
import { useNetwork } from 'wagmi'

export function useChainUnsupported() {
  const { chain: connectedChain } = useNetwork()

  const chainUnsupported = useMemo(() => {
    if (!connectedChain) return false
    return !BigNumber.from(connectedChain.id).eq(readNetwork.chainId)
  }, [connectedChain])

  return chainUnsupported
}
