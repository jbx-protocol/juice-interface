import { t } from '@lingui/macro'
import { BigNumber } from 'ethers'
import { V2V3CurrencyOption } from 'models/v2v3/currencyOption'
import { formatCurrencyAmount } from 'utils/format/formatCurrencyAmount'
import { fromWad } from 'utils/format/formatNumber'
import { V2V3_CURRENCY_ETH } from 'utils/v2v3/currency'
import { MAX_DISTRIBUTION_LIMIT } from 'utils/v2v3/math'

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
