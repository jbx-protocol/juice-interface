import { JBChainId } from "juice-sdk-core";
import { useSuckers } from "juice-sdk-react";
import { useCurrentRouteChainId } from "./useCurrentRouteChainId";

// Gets the projectId of a project on a particular chain
//    -> (Project IDs can vary across chains)
//
// If project does not exist on given chain, returns undefined
export function useProjectIdOfChain({
  chainId
}: {
  chainId: JBChainId | undefined
}) {
  const currentRouteChainId = useCurrentRouteChainId()
  const _chainId = chainId ?? currentRouteChainId
  
  const { data: suckers } = useSuckers()

  return suckers?.find((suckerPair) => suckerPair.peerChainId === _chainId )?.peerChainId
}
