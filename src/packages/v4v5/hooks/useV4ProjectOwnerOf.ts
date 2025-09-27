import { useJBChainId, useJBProjectId } from "juice-sdk-react";
import { JBChainId, jbProjectsAbi, JBCoreContracts, jbContractAddress } from "juice-sdk-core";
import { useReadContract } from "wagmi";
const useV4ProjectOwnerOf = (_chainId?: JBChainId) => {
  const defaultChainId = useJBChainId();
  const chainId = _chainId ?? defaultChainId;
  const { projectId } = useJBProjectId(chainId)
  const { data: projectOwnerAddress, isLoading } = useReadContract({
    abi: jbProjectsAbi,
    address: chainId ? jbContractAddress['4'][JBCoreContracts.JBProjects][chainId] : undefined,
    functionName: 'ownerOf',
    args: [BigInt(projectId ?? 0)],
    chainId
  });

  return {
    data: projectOwnerAddress,
    isLoading
  };
};

export default useV4ProjectOwnerOf;
