import * as constants from '@ethersproject/constants';
import { NATIVE_TOKEN } from 'juice-sdk-core';
import { useJBContractContext, useReadJbFundAccessLimitsPayoutLimitsOf } from 'juice-sdk-react';
import { V4CurrencyOption } from '../models/v4CurrencyOption';
import { useJBQueuedRuleset } from './useJBQueuedRuleset';

/**
 * @todo add to sdk
 */
export function useQueuedPayoutLimits() {
  const {
    projectId,
    contracts: { primaryNativeTerminal: _primaryNativeTerminal },
  } = useJBContractContext()

  const { ruleset: latestQueuedRuleset } = useJBQueuedRuleset();

  const primaryNativeTerminal = _primaryNativeTerminal.data;

  const queuedPayoutLimits = useReadJbFundAccessLimitsPayoutLimitsOf({
      args: [
        projectId,
        latestQueuedRuleset?.id ?? 0n,
        primaryNativeTerminal ?? constants.AddressZero,
        NATIVE_TOKEN,
      ]
  });
  const queuedPayoutLimit = queuedPayoutLimits?.data?.[0]
  return {
    data: {
      ...queuedPayoutLimit,
      currency: queuedPayoutLimit?.currency as V4CurrencyOption | undefined,
    },
    isLoading: queuedPayoutLimits?.isLoading,
  };
}
