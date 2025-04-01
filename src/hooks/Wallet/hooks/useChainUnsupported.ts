import { useSetChain } from '@web3-onboard/react'
import { readNetwork } from 'constants/networks'
import { useJBChainId } from 'juice-sdk-react'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import { featureFlagEnabled } from 'utils/featureFlags'

export function useChainUnsupported() {
  const [{ connectedChain }] = useSetChain()

  // get v4 chain id
  const chainId = useJBChainId()
  const router = useRouter()

  const chainUnsupported = useMemo(() => {
    if (!connectedChain) {
      return false
    }

    // dont show button on create flow tho. here be bong smoke.
    if (featureFlagEnabled('v4') && router.pathname.includes('/create')) {
      return false
    }

    // account for v4
    if (chainId) {
      return Number(connectedChain.id) !== chainId
    }

    return Number(connectedChain.id) !== readNetwork.chainId
  }, [connectedChain, chainId, router])

  return chainUnsupported
}
