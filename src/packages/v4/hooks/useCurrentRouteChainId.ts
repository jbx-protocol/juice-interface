import { useRouter } from 'next/router'
import { chainNameMap } from '../utils/networks'

export function useCurrentRouteChainId() {
  const router = useRouter()
  const { chainName } = router.query
  if (!chainName) {
    return null
  }

  return chainNameMap[chainName as string]
}
