import * as constants from '@ethersproject/constants';
import { NATIVE_TOKEN } from 'juice-sdk-core';
import { useJBContractContext, useJBRuleset, useReadJbFundAccessLimitsPayoutLimitsOf } from 'juice-sdk-react';
import { V4CurrencyOption } from '../models/v4CurrencyOption';

/**
 * @todo add to sdk
 */
export function usePayoutLimits() {
  const {
    projectId,
    contracts: { primaryNativeTerminal: _primaryNativeTerminal },
  } = useJBContractContext();

  const { data: ruleset } = useJBRuleset();

  const primaryNativeTerminal = _primaryNativeTerminal.data;

  const payoutLimits = useReadJbFundAccessLimitsPayoutLimitsOf({
    args: [
      projectId,
      ruleset?.id ?? 0n,
      primaryNativeTerminal ?? constants.AddressZero,
      NATIVE_TOKEN,
    ],
  });
  const payoutLimit = payoutLimits?.data?.[0];
  return {
    data: {
      ...payoutLimit,
      currency: payoutLimit?.currency as V4CurrencyOption | undefined,
    },
    isLoading: payoutLimits?.isLoading,
  };
}
