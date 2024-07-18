import * as constants from '@ethersproject/constants'
import { t } from '@lingui/macro'
import { NATIVE_TOKEN } from 'juice-sdk-core'
import { NativeTokenValue, useJBContractContext, useJBRulesetMetadata, useNativeTokenSurplus, useReadJbTerminalStoreBalanceOf } from 'juice-sdk-react'
import { usePayoutLimits } from 'packages/v4/hooks/usePayoutLimits'
import { MAX_PAYOUT_LIMIT } from 'packages/v4/utils/math'
import { useMemo } from 'react'
import { useV4DistributableAmount } from './useV4DistributableAmount'

export const useV4TreasuryStats = () => {
  const { data: rulesetMetadata } = useJBRulesetMetadata()
  const { projectId, contracts: { primaryNativeTerminal } } = useJBContractContext()
  const { distributableAmount } = useV4DistributableAmount()
  const { data: surplusInNativeToken } = useNativeTokenSurplus()

  const { data: _treasuryBalance } = useReadJbTerminalStoreBalanceOf({
    address: primaryNativeTerminal.data ?? undefined, // TODO: this must be wrong, find terminalStore address
    args: [
        primaryNativeTerminal.data ?? constants.AddressZero,
        projectId,
        NATIVE_TOKEN
    ]
  })

  const { data: payoutLimit } = usePayoutLimits()

  const treasuryBalance = useMemo(() => {
    if (!_treasuryBalance) return undefined

    return (
      <NativeTokenValue
        wei={_treasuryBalance}
      />
    )
  }, [_treasuryBalance])


  const surplus = useMemo(() => {
    if (payoutLimit && payoutLimit.amount === MAX_PAYOUT_LIMIT) return t`No surplus`

    return (
      <NativeTokenValue
        wei={surplusInNativeToken ?? 0n}
      />
    )
  }, [
    surplusInNativeToken,
    payoutLimit,
  ])

  const availableToPayout = useMemo(() => {
    return (
      <NativeTokenValue
        wei={distributableAmount}
      />
    )
  }, [distributableAmount])
  return {
    treasuryBalance,
    availableToPayout,
    surplus,
    redemptionRate: rulesetMetadata?.redemptionRate,
  }
}
