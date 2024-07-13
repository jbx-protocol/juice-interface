import * as constants from '@ethersproject/constants';
import { NATIVE_TOKEN } from 'juice-sdk-core';
import { useJBContractContext, useReadJbFundAccessLimitsPayoutLimitsOf, useReadJbRulesetsLatestQueuedOf } from 'juice-sdk-react';
import { V4CurrencyOption } from '../models/v4CurrencyOption';

/**
 * @todo add to sdk
 */
export function useQueuedPayoutLimits() {
  const {
    projectId,
    contracts: { primaryNativeTerminal: _primaryNativeTerminal },
  } = useJBContractContext()

  const { data: _latestQueuedRuleset } = useReadJbRulesetsLatestQueuedOf();

  const primaryNativeTerminal = _primaryNativeTerminal.data;

  const latestQueuedRuleset = _latestQueuedRuleset?.[0];

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
