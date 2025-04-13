import { useSetChain } from '@web3-onboard/react'
import { readNetwork } from 'constants/networks'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import { featureFlagEnabled } from 'utils/featureFlags'

export function useChainUnsupported() {
  const [{ connectedChain }] = useSetChain()

  const router = useRouter()

  const chainUnsupported = useMemo(() => {
    if (!connectedChain || router.pathname.includes('/v4')) {
      return false
    }

    const isV4Create = featureFlagEnabled('v4') && router.pathname.includes('/create')
    const isV4ProjectPage = router.pathname.includes('/v4')
    
    // dont show buttons on v4 stuff
    if (isV4Create || isV4ProjectPage) {
      return false
    }
    
    return Number(connectedChain.id) !== readNetwork.chainId
  }, [connectedChain, router])

  return chainUnsupported
}
