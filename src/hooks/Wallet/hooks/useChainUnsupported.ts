import { useSetChain } from '@web3-onboard/react'
import { useMemo } from 'react'

import { readNetwork } from 'constants/networks'

export function useChainUnsupported() {
  const [{ connectedChain }] = useSetChain()
  const chainUnsupported = useMemo(() => {
    if (!connectedChain) return false
    return Number(BigInt(connectedChain.id)) !== readNetwork.chainId
  }, [connectedChain])

  return chainUnsupported
}
