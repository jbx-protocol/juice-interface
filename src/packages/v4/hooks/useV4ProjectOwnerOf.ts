import { useJBChainId, useJBProjectId, useReadJbProjectsOwnerOf } from "juice-sdk-react";

import { JBChainId } from "juice-sdk-core";
const useV4ProjectOwnerOf = (_chainId?: JBChainId) => {
  const defaultChainId = useJBChainId();
  const chainId = _chainId ?? defaultChainId;
  const { projectId } = useJBProjectId(chainId)
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
