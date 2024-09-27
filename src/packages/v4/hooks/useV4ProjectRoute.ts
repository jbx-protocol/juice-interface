import { useChainId } from 'wagmi'
import { v4ProjectRoute } from '../utils/routes'

export function useV4ProjectRoute(projectId: number) {
  const chainId = useChainId()

  return v4ProjectRoute({
    chainId,
    projectId,
  })
}
