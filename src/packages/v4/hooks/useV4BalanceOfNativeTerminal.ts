import {
  JBChainId,
  useJBTerminalContext,
  useReadJbDirectoryPrimaryTerminalOf,
  useReadJbTerminalStoreBalanceOf
} from 'juice-sdk-react';

import { NATIVE_TOKEN } from 'juice-sdk-core';
import { zeroAddress } from 'viem';

export const useV4BalanceOfNativeTerminal = ({ chainId, projectId }: { chainId: JBChainId | undefined, projectId: bigint | undefined }) => {
  const { store } = useJBTerminalContext();

  const { data: terminalAddress } = useReadJbDirectoryPrimaryTerminalOf({
    chainId,
    args: [projectId ?? 0n, NATIVE_TOKEN],
  })

  const { data: treasuryBalance, isLoading } = useReadJbTerminalStoreBalanceOf({
    address: store.data ?? undefined,
    chainId,
    args: [
      terminalAddress ?? zeroAddress,
      projectId ?? 0n,
      NATIVE_TOKEN,
    ],
  });

  return { data: treasuryBalance, isLoading };
};
