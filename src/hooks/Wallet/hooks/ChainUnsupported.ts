import { useSetChain } from '@web3-onboard/react'
import { BigNumber } from '@ethersproject/bignumber'
import { useMemo } from 'react'

import { readNetwork } from 'constants/networks'

export function useChainUnsupported() {
  const [{ connectedChain }] = useSetChain()
  const chainUnsupported = useMemo(() => {
    if (!connectedChain) return false
    return !BigNumber.from(connectedChain.id).eq(readNetwork.chainId)
  }, [connectedChain])

  return chainUnsupported
}
