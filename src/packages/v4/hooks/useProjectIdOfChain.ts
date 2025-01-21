import { JBChainId } from "juice-sdk-core";
import { useSuckers } from "juice-sdk-react";

// Gets the projectId of a project on a given chain
//    -> (Project IDs can vary across chains)
export function useProjectIdOfChain({
  chainId
}: {
  chainId: JBChainId | undefined
}) {  
  const { data: suckers } = useSuckers()

  return suckers?.find((suckerPair) => suckerPair.peerChainId === chainId )?.projectId
}
