import * as constants from '@ethersproject/constants'

import {
  JBChainId,
  useJBContractContext,
  useJBRuleset,
  useReadJbDirectoryPrimaryTerminalOf,
  useReadJbFundAccessLimitsPayoutLimitsOf,
} from 'juice-sdk-react'

import { NATIVE_TOKEN } from 'juice-sdk-core'
import { V4CurrencyOption } from '../models/v4CurrencyOption'
import { V4_CURRENCY_ETH } from '../utils/currency'

/**
 * V4todo: add to SDK
 */
export function usePayoutLimitOfChain({
  chainId,
  projectId,
}: {
  chainId: JBChainId | undefined,
  projectId: bigint | undefined
}) {
  const {
    contracts: { fundAccessLimits },
  } = useJBContractContext()

  const { data: ruleset } = useJBRuleset() // !!!!!v4TODO: pass chainId here once sdk updated

  const { data: terminalAddress } = useReadJbDirectoryPrimaryTerminalOf({
      chainId,
      args: [projectId ?? 0n, NATIVE_TOKEN],
    })
  const { data: payoutLimits, isLoading } =
    useReadJbFundAccessLimitsPayoutLimitsOf({
      address: fundAccessLimits.data ?? undefined,
      chainId,
      args: [
        projectId ?? 0n,
        BigInt(ruleset?.id ?? 0),
        terminalAddress ?? constants.AddressZero,
        NATIVE_TOKEN,
      ],
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
