import { NATIVE_CURRENCY_ID, NATIVE_TOKEN } from 'juice-sdk-core'
import {
  useJBContractContext,
  useJBRulesetContext,
  useJBTerminalContext,
  useReadJbTerminalStoreBalanceOf,
  useReadJbTerminalStoreUsedPayoutLimitOf,
} from 'juice-sdk-react'
import { usePayoutLimits } from 'packages/v4/hooks/usePayoutLimits'
import { zeroAddress } from 'viem'

export const useV4DistributableAmount = () => {
  const { store } = useJBTerminalContext()
  const { projectId, contracts } = useJBContractContext()
  const { ruleset } = useJBRulesetContext()
  const { data: usedPayoutLimit } = useReadJbTerminalStoreUsedPayoutLimitOf({
    address: store.data ?? undefined,
    args: [
      contracts.primaryNativeTerminal.data ?? zeroAddress,
      projectId,
      NATIVE_TOKEN,
      ruleset.data?.cycleNumber ?? 0n,
      NATIVE_CURRENCY_ID,
    ],
  })

  const { data: _balanceInPayoutLimitCurrency } =
    useReadJbTerminalStoreBalanceOf({
      address: store.data ?? undefined,
      args: [
        contracts.primaryNativeTerminal.data ?? zeroAddress,
        projectId,
        NATIVE_TOKEN,
      ],
    })

  const { data: payoutLimit } = usePayoutLimits()

  const effectiveDistributionLimit = payoutLimit?.amount ?? 0n
  const distributedAmount = usedPayoutLimit ?? 0n
  const balanceInDistributionLimit = _balanceInPayoutLimitCurrency ?? 0n

  const distributable =
    effectiveDistributionLimit === 0n
      ? effectiveDistributionLimit
      : effectiveDistributionLimit - distributedAmount

  const distributableAmount =
    balanceInDistributionLimit > distributable
      ? distributable
      : balanceInDistributionLimit

  return {
    distributableAmount,
    currency: payoutLimit?.currency,
  }
}
