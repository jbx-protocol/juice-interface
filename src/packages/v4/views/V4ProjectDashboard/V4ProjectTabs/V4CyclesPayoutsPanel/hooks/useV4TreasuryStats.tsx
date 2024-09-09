import { t } from '@lingui/macro'
import {
  NativeTokenValue,
  useJBRulesetMetadata,
  useNativeTokenSurplus,
} from 'juice-sdk-react'
import { usePayoutLimit } from 'packages/v4/hooks/usePayoutLimit'
import { useV4BalanceOfNativeTerminal } from 'packages/v4/hooks/useV4BalanceOfNativeTerminal'
import { MAX_PAYOUT_LIMIT } from 'packages/v4/utils/math'
import { useMemo } from 'react'
import { useV4DistributableAmount } from './useV4DistributableAmount'

export const useV4TreasuryStats = () => {
  const { data: rulesetMetadata } = useJBRulesetMetadata()
  const { distributableAmount } = useV4DistributableAmount()
  const { data: surplusInNativeToken } = useNativeTokenSurplus()

  const { data: _treasuryBalance } = useV4BalanceOfNativeTerminal()

  const { data: payoutLimit } = usePayoutLimit()

  const treasuryBalance = <NativeTokenValue wei={_treasuryBalance ?? 0n} />

  const surplus = useMemo(() => {
    if (payoutLimit && payoutLimit.amount === MAX_PAYOUT_LIMIT)
      return t`No surplus`

    return <NativeTokenValue wei={surplusInNativeToken ?? 0n} />
  }, [surplusInNativeToken, payoutLimit])

  const availableToPayout = <NativeTokenValue wei={distributableAmount.value} />
  return {
    treasuryBalance,
    availableToPayout,
    surplus,
    redemptionRate: rulesetMetadata?.redemptionRate,
  }
}
