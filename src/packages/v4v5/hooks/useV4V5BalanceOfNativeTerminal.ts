import {
  JBChainId,
  useJBTerminalContext,
} from 'juice-sdk-react';

import { NATIVE_TOKEN, jbDirectoryAbi, jbTerminalStoreAbi, jbContractAddress, JBCoreContracts } from 'juice-sdk-core';
import { useReadContract } from 'wagmi';
import { zeroAddress } from 'viem';
import { useV4V5Version } from '../contexts/V4V5VersionProvider';

export const useV4V5BalanceOfNativeTerminal = ({ chainId, projectId }: { chainId: JBChainId | undefined, projectId: bigint | undefined }) => {
  const { store } = useJBTerminalContext();
  const { version } = useV4V5Version();

  const versionString = version.toString() as '4' | '5';
  const directoryAddress = chainId ? jbContractAddress[versionString][JBCoreContracts.JBDirectory][chainId] : undefined;

  const { data: terminalAddress } = useReadContract({
    abi: jbDirectoryAbi,
    address: directoryAddress,
    functionName: 'primaryTerminalOf',
    args: [projectId ?? 0n, NATIVE_TOKEN],
    chainId,
  });

  const { data: treasuryBalance, isLoading } = useReadContract({
    abi: jbTerminalStoreAbi,
    address: store.data ?? undefined,
    functionName: 'balanceOf',
    args: [
      terminalAddress ?? zeroAddress,
      projectId ?? 0n,
      NATIVE_TOKEN,
    ],
    chainId,
  });

  return { data: treasuryBalance, isLoading };
};
