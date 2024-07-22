import { WeiPerEther } from '@ethersproject/constants';
import { useJBContractContext, useReadJbControllerTotalTokenSupplyWithReservedTokensOf } from 'juice-sdk-react';
import { useMemo } from 'react';

export const useV4TotalTokenSupply = () => {
  const { projectId, contracts: { controller } } = useJBContractContext();

  const { data: totalTokenSupplyWei, isLoading } = useReadJbControllerTotalTokenSupplyWithReservedTokensOf({
    address: controller.data ?? undefined,
    args: [projectId],
  });

  const totalTokenSupply = useMemo(() => {
    return (totalTokenSupplyWei ?? 0n) / WeiPerEther.toBigInt()
  }, [totalTokenSupplyWei]);

  return {
    data: totalTokenSupply, 
    isLoading
  };
};
