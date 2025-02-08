import {
  JBChainId,
  useJBContractContext,
  useJBTerminalContext,
  useReadJbTerminalStoreBalanceOf,
} from 'juice-sdk-react';

import { NATIVE_TOKEN } from 'juice-sdk-core';
import { zeroAddress } from 'viem';

export const useV4BalanceOfNativeTerminal = ({ chainId, projectId }: { chainId: JBChainId | undefined, projectId: bigint | undefined }) => {
  const { store } = useJBTerminalContext();
  const { contracts } = useJBContractContext();

  const { data: treasuryBalance, isLoading } = useReadJbTerminalStoreBalanceOf({
    address: store.data ?? undefined,
    chainId,
    args: [
      contracts.primaryNativeTerminal.data ?? zeroAddress, // is this right, or should be below?
      // useReadJbDirectoryPrimaryTerminalOf({
          //   chainId,
          //   args: [projectId, NATIVE_TOKEN],
          // }) 
      projectId ?? 0n,
      NATIVE_TOKEN,
    ],
  });

  return { data: treasuryBalance, isLoading };
};
