import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import { V2V3CurrencyOption } from 'models/v2v3/currencyOption'
import { useContext } from 'react'
import { V2V3_CURRENCY_ETH } from 'utils/v2v3/currency'

export const useDistributableAmount = () => {
  const {
    distributionLimit,
    usedDistributionLimit,
    balanceInDistributionLimitCurrency,
    distributionLimitCurrency,
  } = useContext(V2V3ProjectContext)

  const currency = (
    distributionLimitCurrency
      ? Number(distributionLimitCurrency)
      : V2V3_CURRENCY_ETH
  ) as V2V3CurrencyOption

  const effectiveDistributionLimit = distributionLimit ?? BigInt(0)
  const distributedAmount = usedDistributionLimit ?? BigInt(0)
  const balInDistributionLimit = balanceInDistributionLimitCurrency ?? BigInt(0)

  const distributable =
    effectiveDistributionLimit === 0n
      ? effectiveDistributionLimit
      : effectiveDistributionLimit - distributedAmount

  const distributableAmount =
    balInDistributionLimit > distributable
      ? distributable
      : balInDistributionLimit

  return {
    distributableAmount,
    currency,
  }
}
