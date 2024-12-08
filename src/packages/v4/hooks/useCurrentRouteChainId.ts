import { useRouter } from 'next/router'
import { chainNameMap } from '../utils/networks'

export function useCurrentRouteChainId() {
  const router = useRouter()
  const { chainName } = router.query

  return chainNameMap[chainName as string]
}
