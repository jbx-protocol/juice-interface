import * as constants from '@ethersproject/constants'

import {
  useJBChainId,
  useJBContractContext,
  useJBProjectId,
  useJBRuleset,
  useReadJbFundAccessLimitsPayoutLimitsOf,
} from 'juice-sdk-react'

import { NATIVE_TOKEN } from 'juice-sdk-core'
import { V4CurrencyOption } from '../models/v4CurrencyOption'
import { V4_CURRENCY_ETH } from '../utils/currency'

/**
 * @todo add to sdk
 */
export function usePayoutLimit() {
  const chainId = useJBChainId()
  const {
    contracts: { primaryNativeTerminal, fundAccessLimits },
  } = useJBContractContext()
  const { projectId } = useJBProjectId(chainId)
  const { ruleset } = useJBRuleset({
    projectId,
    chainId,
  })
  const { data: payoutLimits, isLoading } =
    useReadJbFundAccessLimitsPayoutLimitsOf({
      chainId,
      address: fundAccessLimits.data ?? undefined,
      args:
        primaryNativeTerminal.data && fundAccessLimits.data && projectId
          ? [
              projectId,
              BigInt(ruleset?.id ?? 0),
              primaryNativeTerminal.data ?? constants.AddressZero,
              NATIVE_TOKEN,
            ]
          : undefined,
      query: {
        enabled: Boolean(fundAccessLimits.data && primaryNativeTerminal.data),
      },
    })

  const payoutLimit = payoutLimits?.[0]

  return {
    data: payoutLimit
      ? {
          ...payoutLimit,
          currency: Number(payoutLimit.currency) as V4CurrencyOption,
        }
      : {
          amount: 0n,
          currency: V4_CURRENCY_ETH,
        },
    isLoading,
  }
}
