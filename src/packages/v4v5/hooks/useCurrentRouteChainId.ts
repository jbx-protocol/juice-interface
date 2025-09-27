import { JB_CHAIN_SLUGS, JBChainId } from 'juice-sdk-core'
import { useRouter } from 'next/router'

export function useCurrentRouteChainId() {
  const router = useRouter()
  const { chainName } = router.query

  return JB_CHAIN_SLUGS[chainName as string].chain.id as JBChainId | undefined
}
