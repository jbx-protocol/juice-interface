import { t } from '@lingui/macro'
import { BigNumber } from 'ethers'
import { V2V3CurrencyOption } from 'packages/v2v3/models/currencyOption'
import { V2V3_CURRENCY_ETH } from 'packages/v2v3/utils/currency'
import { formatCurrencyAmount } from 'packages/v2v3/utils/formatCurrencyAmount'
import { MAX_DISTRIBUTION_LIMIT } from 'packages/v2v3/utils/math'
import { fromWad } from 'utils/format/formatNumber'

// Formats a funding target into the format:
// {prefix} 99,999 {suffix}
// where prefix and suffix is set based on distributionLimitCurrency
export function formatFundingTarget({
  distributionLimitWad,
  distributionLimitCurrency = V2V3_CURRENCY_ETH,
}: {
  distributionLimitWad: BigNumber | undefined
  distributionLimitCurrency: V2V3CurrencyOption | undefined
}) {
  const limit = distributionLimitWad ?? BigNumber.from(0)
  if (limit.eq(0)) {
    return t`Zero`
  }
  if (limit.eq(MAX_DISTRIBUTION_LIMIT)) {
    return t`Unlimited`
  }

  return formatCurrencyAmount({
    amount: parseFloat(fromWad(limit)),
    currency: distributionLimitCurrency,
  })
}
