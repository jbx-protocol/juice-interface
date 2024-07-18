import { useJBContractContext, useReadJbProjectsOwnerOf } from "juice-sdk-react";

const useProjectOwnerOf = () => {
  const { projectId } = useJBContractContext();

  const { data: projectOwnerAddress, isLoading } = useReadJbProjectsOwnerOf({
    args: [projectId],
  });

  return {
    data: projectOwnerAddress,
    isLoading
  };
};

export default useProjectOwnerOf;
