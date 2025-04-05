import { useJBChainId, useReadJbProjectsOwnerOf } from "juice-sdk-react";

import { JBChainId } from "juice-sdk-core";
import { useProjectIdOfChain } from "./useProjectIdOfChain";

const useV4ProjectOwnerOf = (_chainId?: JBChainId) => {
  const defaultChainId = useJBChainId();
  const chainId = _chainId ?? defaultChainId;
  const projectId = useProjectIdOfChain({ chainId })
  const { data: projectOwnerAddress, isLoading } = useReadJbProjectsOwnerOf({
    args: [BigInt(projectId ?? 0)],
    chainId
  });

  return {
    data: projectOwnerAddress,
    isLoading
  };
};

export default useV4ProjectOwnerOf;
