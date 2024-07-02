import { BigNumber } from 'ethers'
import { V2V3ProjectContext } from 'packages/v2v3/contexts/Project/V2V3ProjectContext'
import { V2V3CurrencyOption } from 'packages/v2v3/models/currencyOption'
import { V2V3_CURRENCY_ETH } from 'packages/v2v3/utils/currency'
import { useContext } from 'react'

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
