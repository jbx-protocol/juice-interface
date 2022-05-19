import { BigNumber } from '@ethersproject/bignumber'
import { Trans } from '@lingui/macro'
import CurrencySymbol from 'components/shared/CurrencySymbol'
import { formatWad } from 'utils/formatNumber'
import { MAX_DISTRIBUTION_LIMIT } from 'utils/v2/math'

import { CurrencyName } from 'constants/currency'

export default function DistributionLimit({
  distributionLimit,
  currencyName,
}: {
  distributionLimit: BigNumber | undefined
  currencyName: CurrencyName | undefined
}) {
  const distributionLimitIsInfinite = distributionLimit?.eq(
    MAX_DISTRIBUTION_LIMIT,
  )
  const distributionLimitIsZero = distributionLimit?.eq(0)

  if (distributionLimitIsInfinite) {
    return <Trans>No limit (infinite)</Trans>
  } else if (distributionLimitIsZero) {
    return <Trans>Zero</Trans>
  }
  return (
    <>
      <CurrencySymbol currency={currencyName} />
      {formatWad(distributionLimit)}
    </>
  )
}
