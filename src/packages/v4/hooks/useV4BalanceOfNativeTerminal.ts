import { NATIVE_TOKEN } from 'juice-sdk-core';
import {
  useJBContractContext,
  useJBTerminalContext,
  useReadJbTerminalStoreBalanceOf,
} from 'juice-sdk-react';
import { zeroAddress } from 'viem';

export const useV4BalanceOfNativeTerminal = () => {
  const { store } = useJBTerminalContext();
  const { projectId, contracts } = useJBContractContext();

  const { data: treasuryBalance, isLoading } = useReadJbTerminalStoreBalanceOf({
    address: store.data ?? undefined,
    args: [
      contracts.primaryNativeTerminal.data ?? zeroAddress,
      projectId,
      NATIVE_TOKEN,
    ],
  });

  return { data: treasuryBalance, isLoading };
};
