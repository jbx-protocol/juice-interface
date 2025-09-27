import * as constants from '@ethersproject/constants'

import {
  useJBChainId,
  useJBContractContext,
  useJBProjectId,
  useJBRuleset,
} from 'juice-sdk-react'
import { jbFundAccessLimitsAbi } from 'juice-sdk-core'
import { useReadContract } from 'wagmi'

import { NATIVE_TOKEN } from 'juice-sdk-core'
import { V4V5CurrencyOption } from '../models/v4CurrencyOption'
import { V4V5_CURRENCY_ETH } from '../utils/currency'

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
  const { data: payoutLimits, isLoading } = useReadContract({
    abi: jbFundAccessLimitsAbi,
    address: fundAccessLimits.data ?? undefined,
    functionName: 'payoutLimitsOf',
    args:
      primaryNativeTerminal.data && fundAccessLimits.data && projectId
        ? [
            projectId,
            BigInt(ruleset?.id ?? 0),
            primaryNativeTerminal.data ?? constants.AddressZero,
            NATIVE_TOKEN,
          ]
        : undefined,
    chainId,
    query: {
      enabled: Boolean(fundAccessLimits.data && primaryNativeTerminal.data),
    },
  })
  if (payoutLimits === undefined) {
    return {
      data: {
        amount: 0n,
        currency: V4V5_CURRENCY_ETH,
      },
      isLoading: true,
    }
  }
  const payoutLimit = payoutLimits?.[0]
  return {
    data: payoutLimit !== undefined
      ? {
          ...payoutLimit,
          currency: Number(payoutLimit.currency) as V4V5CurrencyOption,
        }
      : {
          amount: 0n,
          currency: V4V5_CURRENCY_ETH,
        },
    isLoading,
  }
}
