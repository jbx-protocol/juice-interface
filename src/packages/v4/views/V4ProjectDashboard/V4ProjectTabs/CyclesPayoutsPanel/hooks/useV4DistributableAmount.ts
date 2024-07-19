import { usePayoutLimit } from 'packages/v4/hooks/usePayoutLimit'
import { useUsedPayoutLimitOf } from 'packages/v4/hooks/useUsedPayoutLimitOf'
import { useV4BalanceOfNativeTerminal } from 'packages/v4/hooks/useV4BalanceOfNativeTerminal'

export const useV4DistributableAmount = () => {
  const { data: usedPayoutLimit } = useUsedPayoutLimitOf()

  const { data: _treasuryBalance } = useV4BalanceOfNativeTerminal()

  const { data: payoutLimit } = usePayoutLimit()

  const effectiveDistributionLimit = payoutLimit?.amount ?? 0n
  const distributedAmount = usedPayoutLimit ?? 0n
  const treasuryBalance =
    _treasuryBalance ?? 0n

  const distributable =
    effectiveDistributionLimit === 0n
      ? effectiveDistributionLimit
      : effectiveDistributionLimit - distributedAmount

  const distributableAmount = treasuryBalance > distributable
    ? distributable
    : treasuryBalance

  return {
    distributableAmount,
    currency: payoutLimit?.currency,
  }
}
