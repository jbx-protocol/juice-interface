import { JBProjectToken } from 'juice-sdk-core'
import { usePayoutLimit } from 'packages/v4/hooks/usePayoutLimit'
import { useUsedPayoutLimitOf } from 'packages/v4/hooks/useUsedPayoutLimitOf'
import { useV4BalanceOfNativeTerminal } from 'packages/v4/hooks/useV4BalanceOfNativeTerminal'
import { MAX_PAYOUT_LIMIT } from 'packages/v4/utils/math'

export const useV4DistributableAmount = () => {
  const { data: usedPayoutLimit } = useUsedPayoutLimitOf()

  const { data: _treasuryBalance } = useV4BalanceOfNativeTerminal()

  const { data: payoutLimit } = usePayoutLimit()

  const effectiveDistributionLimit = payoutLimit?.amount ?? MAX_PAYOUT_LIMIT
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
    distributableAmount: new JBProjectToken(distributableAmount),
    currency: payoutLimit?.currency,
  }
}
