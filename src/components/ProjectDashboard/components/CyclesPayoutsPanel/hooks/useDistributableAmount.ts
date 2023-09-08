import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import { BigNumber } from 'ethers'
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

  const currency = (distributionLimitCurrency?.toNumber() ||
    V2V3_CURRENCY_ETH) as V2V3CurrencyOption

  const effectiveDistributionLimit = distributionLimit ?? BigNumber.from(0)
  const distributedAmount = usedDistributionLimit ?? BigNumber.from(0)
  const balInDistributionLimit =
    balanceInDistributionLimitCurrency ?? BigNumber.from(0)

  const distributable = effectiveDistributionLimit.eq(0)
    ? effectiveDistributionLimit
    : effectiveDistributionLimit.sub(distributedAmount)

  const distributableAmount = balInDistributionLimit.gt(distributable)
    ? distributable
    : balInDistributionLimit

  return {
    distributableAmount,
    currency,
  }
}
