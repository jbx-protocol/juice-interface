import { useSetChain } from '@web3-onboard/react'
import { readNetwork } from 'constants/networks'
import { useCurrentRouteChainId } from 'packages/v4/hooks/useCurrentRouteChainId'
import { useMemo } from 'react'

export function useChainUnsupported() {
  const [{ connectedChain }] = useSetChain()

  // get v4 chain id
  const chainId = useCurrentRouteChainId()

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
