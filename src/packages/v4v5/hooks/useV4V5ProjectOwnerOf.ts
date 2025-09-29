import { useJBChainId, useJBProjectId } from "juice-sdk-react";
import { JBChainId, jbProjectsAbi, JBCoreContracts, jbContractAddress } from "juice-sdk-core";
import { useReadContract } from "wagmi";
import { useV4V5Version } from '../contexts/V4V5VersionProvider';

const useV4V5ProjectOwnerOf = (_chainId?: JBChainId) => {
  const defaultChainId = useJBChainId();
  const chainId = _chainId ?? defaultChainId;
  const { projectId } = useJBProjectId(chainId)
  const { version } = useV4V5Version();
  const versionString = version.toString() as '4' | '5';

  const { data: projectOwnerAddress, isLoading } = useReadContract({
    abi: jbProjectsAbi,
    address: chainId ? jbContractAddress[versionString][JBCoreContracts.JBProjects][chainId] : undefined,
    functionName: 'ownerOf',
    args: [BigInt(projectId ?? 0)],
    chainId
  });

  return {
    data: projectOwnerAddress,
    isLoading
  };
};

export default useV4V5ProjectOwnerOf;
