import { JBChainId } from 'juice-sdk-core'
import { useJBChainId, useJBContractContext, useSuckers } from 'juice-sdk-react'

// Gets the projectId of a project on a given chain
//    -> (Project IDs can vary across chains)
export function useProjectIdOfChain({
  chainId,
}: {
  chainId: JBChainId | undefined
}) {
  const currentChainId = useJBChainId()
  const { projectId: currentProjectId } = useJBContractContext()
  const { data: suckers } = useSuckers()

  if (currentChainId === chainId) {
    return currentProjectId
  }

  return suckers?.find(suckerPair => suckerPair.peerChainId === chainId)
    ?.projectId
}
