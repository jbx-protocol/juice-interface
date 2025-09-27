import { useCurrencyConverter } from 'hooks/useCurrencyConverter'
import { JBProjectToken } from 'juice-sdk-core'
import { JBChainId } from 'juice-sdk-react'
import { usePayoutLimitOfChain } from 'packages/v4v5/hooks/usePayoutLimitOfChain'
import { useUsedPayoutLimitOf } from 'packages/v4v5/hooks/useUsedPayoutLimitOf'
import { useV4BalanceOfNativeTerminal } from 'packages/v4v5/hooks/useV4V5BalanceOfNativeTerminal'
import { V4V5_CURRENCY_ETH } from 'packages/v4v5/utils/currency'
import { MAX_PAYOUT_LIMIT } from 'packages/v4v5/utils/math'

export const useV4DistributableAmount = ({
  chainId,
  projectId
}: {
  chainId: JBChainId | undefined,
  projectId: bigint | undefined
}) => {
  const { data: usedPayoutLimit } = useUsedPayoutLimitOf({ chainId, projectId })
  const { data: _treasuryBalance } = useV4BalanceOfNativeTerminal( { chainId, projectId })
  const { data: payoutLimit } = usePayoutLimitOfChain({ chainId, projectId })
  const converter = useCurrencyConverter()

  const effectiveDistributionLimit = payoutLimit?.amount ?? MAX_PAYOUT_LIMIT
  const distributedAmount = usedPayoutLimit ?? 0n
  const treasuryBalance = _treasuryBalance ?? 0n

  const distributable =
    effectiveDistributionLimit === 0n
      ? effectiveDistributionLimit
      : effectiveDistributionLimit - distributedAmount

  const distributableAmountEth =
    treasuryBalance > distributable ? distributable : treasuryBalance

  const distributableAmountUsd = converter.wadToCurrency(distributableAmountEth, 'USD', 'ETH')?.toBigInt() ?? 0n
  const distributableAmountInPayoutLimitCurrency = payoutLimit?.currency === V4V5_CURRENCY_ETH ? distributableAmountEth : distributableAmountUsd

  return {
    distributableAmount: new JBProjectToken(distributableAmountInPayoutLimitCurrency),
    currency: payoutLimit?.currency,
  }
}
