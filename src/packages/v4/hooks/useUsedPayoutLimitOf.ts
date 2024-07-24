import { NATIVE_CURRENCY_ID, NATIVE_TOKEN } from 'juice-sdk-core';
import {
  useJBContractContext,
  useJBRulesetContext,
  useJBTerminalContext,
  useReadJbTerminalStoreUsedPayoutLimitOf,
} from 'juice-sdk-react';
import { zeroAddress } from 'viem';

export const useUsedPayoutLimitOf = () => {
  const { store } = useJBTerminalContext();
  const { projectId, contracts } = useJBContractContext();
  const { ruleset } = useJBRulesetContext();

  const { data: usedPayoutLimit, isLoading } = useReadJbTerminalStoreUsedPayoutLimitOf({
    address: store.data ?? undefined,
    args: [
      contracts.primaryNativeTerminal.data ?? zeroAddress,
      projectId,
      NATIVE_TOKEN,
      BigInt(ruleset.data?.cycleNumber ?? 0),
      NATIVE_CURRENCY_ID,
    ],
  });

  return { data: usedPayoutLimit, isLoading };
};
