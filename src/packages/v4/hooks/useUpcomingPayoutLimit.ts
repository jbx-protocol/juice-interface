import * as constants from '@ethersproject/constants';
import { NATIVE_TOKEN } from 'juice-sdk-core';
import { useJBContractContext, useReadJbFundAccessLimitsPayoutLimitsOf } from 'juice-sdk-react';
import { V4CurrencyOption } from '../models/v4CurrencyOption';
import { useJBUpcomingRuleset } from './useJBUpcomingRuleset';

/**
 * @todo add to sdk
 */
export function useUpcomingPayoutLimit() {
  const {
    projectId,
    contracts: { primaryNativeTerminal: _primaryNativeTerminal },
  } = useJBContractContext()

  const { ruleset: latestUpcomingRuleset } = useJBUpcomingRuleset();

  const primaryNativeTerminal = _primaryNativeTerminal.data;

  const upcomingPayoutLimits = useReadJbFundAccessLimitsPayoutLimitsOf({
      args: [
        projectId,
        latestUpcomingRuleset?.id ?? 0n,
        primaryNativeTerminal ?? constants.AddressZero,
        NATIVE_TOKEN,
      ]
  });
  const upcomingPayoutLimit = upcomingPayoutLimits?.data?.[0]
  return {
    data: {
      ...upcomingPayoutLimit,
      currency: upcomingPayoutLimit?.currency as V4CurrencyOption | undefined,
    },
    isLoading: upcomingPayoutLimits?.isLoading,
  };
}
