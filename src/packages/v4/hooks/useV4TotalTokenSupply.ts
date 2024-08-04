import { useJBContractContext, useReadJbControllerTotalTokenSupplyWithReservedTokensOf } from 'juice-sdk-react';

export const useV4TotalTokenSupply = () => {
  const { projectId, contracts: { controller } } = useJBContractContext();

  const { data: totalTokenSupplyWei, isLoading } = useReadJbControllerTotalTokenSupplyWithReservedTokensOf({
    address: controller.data ?? undefined,
    args: [projectId],
  });

  return {
    data: totalTokenSupplyWei, 
    isLoading
  };
};
