import { useJBContractContext } from 'juice-sdk-react';
import { jbControllerAbi } from 'juice-sdk-core';
import { useReadContract } from 'wagmi';

export const useV4V5TotalTokenSupply = () => {
  const { projectId, contracts: { controller } } = useJBContractContext();

  const { data: totalTokenSupplyWei, isLoading } = useReadContract({
    abi: jbControllerAbi,
    address: controller.data ?? undefined,
    functionName: 'totalTokenSupplyWithReservedTokensOf',
    args: [projectId],
  });

  return {
    data: totalTokenSupplyWei, 
    isLoading
  };
};
