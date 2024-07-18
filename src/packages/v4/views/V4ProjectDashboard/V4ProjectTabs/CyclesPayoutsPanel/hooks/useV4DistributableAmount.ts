import * as constants from '@ethersproject/constants'
import { NATIVE_TOKEN } from 'juice-sdk-core'
import { useJBContractContext, useReadJbTerminalStoreBalanceOf, useReadJbTerminalStoreUsedPayoutLimitOf } from 'juice-sdk-react'
import { usePayoutLimits } from 'packages/v4/hooks/usePayoutLimits'

export const useV4DistributableAmount = () => {
  const { projectId, contracts: { primaryNativeTerminal }} = useJBContractContext()
  const { data: usedPayoutLimit } = useReadJbTerminalStoreUsedPayoutLimitOf()

  const { data: _treasuryBalance } = useReadJbTerminalStoreBalanceOf({
    address: primaryNativeTerminal.data ?? undefined, // TODO: this must be wrong, find terminalStore address
    args: [
        primaryNativeTerminal.data ?? constants.AddressZero,
        projectId,
        NATIVE_TOKEN
    ]
  })

  const { data: payoutLimit } = usePayoutLimits()

  const effectiveDistributionLimit = payoutLimit?.amount ?? 0n
  const distributedAmount = usedPayoutLimit ?? 0n
  const treasuryBalance =
    _treasuryBalance ?? 0n

  const distributable = effectiveDistributionLimit === 0n
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
