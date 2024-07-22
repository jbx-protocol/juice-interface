import * as constants from '@ethersproject/constants';
import { NATIVE_TOKEN } from 'juice-sdk-core';
import { useJBContractContext, useJBRuleset, useReadJbFundAccessLimitsPayoutLimitsOf } from 'juice-sdk-react';
import { V4CurrencyOption } from '../models/v4CurrencyOption';

/**
 * @todo add to sdk
 */
export function usePayoutLimit() {
  const {
    projectId,
    contracts: { primaryNativeTerminal, fundAccessLimits },
  } = useJBContractContext();

  const { data: ruleset } = useJBRuleset();


  const { data: payoutLimits, isLoading } = useReadJbFundAccessLimitsPayoutLimitsOf({
    address: fundAccessLimits.data ?? undefined,
    args: [
      projectId,
      ruleset?.id ?? 0n,
      primaryNativeTerminal.data ?? constants.AddressZero,
      NATIVE_TOKEN,
    ],
  });
  const payoutLimit = payoutLimits?.[0];
  return {
    data: payoutLimit ? {
      ...payoutLimit,
      currency: Number(payoutLimit.currency) as V4CurrencyOption,
    }: undefined,
    isLoading
  };
}
