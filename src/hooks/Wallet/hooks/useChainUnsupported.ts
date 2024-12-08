import { useSetChain } from '@web3-onboard/react'
import { readNetwork } from 'constants/networks'
import { useJBChainId } from 'juice-sdk-react'
import { useMemo } from 'react'

export function useChainUnsupported() {
  const [{ connectedChain }] = useSetChain()

  // get v4 chain id
  const chainId = useJBChainId()

  const chainUnsupported = useMemo(() => {
    if (!connectedChain) {
      return false
    }

    // account for v4
    if (chainId) {
      return Number(connectedChain.id) !== chainId
    }

    return Number(connectedChain.id) !== readNetwork.chainId
  }, [connectedChain, chainId])

  return chainUnsupported
}
