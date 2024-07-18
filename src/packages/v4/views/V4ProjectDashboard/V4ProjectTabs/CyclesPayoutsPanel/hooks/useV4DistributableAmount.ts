import { useReadJbProjectsBalanceOf, useReadJbTerminalStoreUsedPayoutLimitOf } from 'juice-sdk-react'
import { usePayoutLimits } from 'packages/v4/hooks/usePayoutLimits'

export const useV4DistributableAmount = () => {
  const { data: usedPayoutLimit } = useReadJbTerminalStoreUsedPayoutLimitOf()

  const { data: _balanceInPayoutLimitCurrency } = useReadJbProjectsBalanceOf()

  const { data: payoutLimit } = usePayoutLimits()

  const effectiveDistributionLimit = payoutLimit?.amount ?? 0n
  const distributedAmount = usedPayoutLimit ?? 0n
  const balanceInDistributionLimit =
    _balanceInPayoutLimitCurrency ?? 0n

  const distributable = effectiveDistributionLimit === 0n
    ? effectiveDistributionLimit
    : effectiveDistributionLimit - distributedAmount

  const distributableAmount = balanceInDistributionLimit > distributable
    ? distributable
    : balanceInDistributionLimit

  return {
    distributableAmount,
    currency: payoutLimit?.currency,
  }
}
