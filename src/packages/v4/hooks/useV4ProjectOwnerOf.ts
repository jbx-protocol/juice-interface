import { JBChainId } from "juice-sdk-core";
import { useReadJbProjectsOwnerOf } from "juice-sdk-react";
import { useProjectIdOfChain } from "./useProjectIdOfChain";

const useV4ProjectOwnerOf = (chainId?: JBChainId) => {
  const projectId = useProjectIdOfChain({ chainId })

  const { data: projectOwnerAddress, isLoading } = useReadJbProjectsOwnerOf({
    args: [BigInt(projectId ?? 0)],
  });

  return {
    data: projectOwnerAddress,
    isLoading
  };
};

export default useV4ProjectOwnerOf;
