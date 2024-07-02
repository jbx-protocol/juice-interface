import { t } from '@lingui/macro'
import { V2V3CurrencyOption } from 'packages/v2v3/models/currencyOption'
import { V2V3_CURRENCY_ETH } from 'packages/v2v3/utils/currency'
import { isInfiniteDistributionLimit } from 'packages/v2v3/utils/fundingCycle'
import { formatCurrencyAmount } from 'utils/format/formatCurrencyAmount'
import { fromWad } from 'utils/format/formatNumber'

// Formats a funding target into the format:
// {prefix} 99,999 {suffix}
// where prefix and suffix is set based on distributionLimitCurrency
export function formatFundingTarget({
  distributionLimitWad,
  distributionLimitCurrency = V2V3_CURRENCY_ETH,
}: {
  distributionLimitWad: bigint | undefined
  distributionLimitCurrency: V2V3CurrencyOption | undefined
}) {
  const limit = distributionLimitWad ?? BigInt(0)
  if (limit === 0n) {
    return t`Zero`
  }
  if (isInfiniteDistributionLimit(limit)) {
    return t`Unlimited`
  }

  return formatCurrencyAmount({
    amount: parseFloat(fromWad(limit)),
    currency: distributionLimitCurrency,
  })
}
