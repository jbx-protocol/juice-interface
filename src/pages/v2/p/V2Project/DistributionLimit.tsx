import { BigNumber } from '@ethersproject/bignumber'
import { Trans } from '@lingui/macro'
import CurrencySymbol from 'components/shared/CurrencySymbol'
import { formatWad } from 'utils/formatNumber'
import { MAX_DISTRIBUTION_LIMIT } from 'utils/v2/math'
import TooltipIcon from 'components/shared/TooltipIcon'

import { useContext } from 'react'
import { ThemeContext } from 'contexts/themeContext'

import { CurrencyName } from 'constants/currency'

export default function DistributionLimit({
  distributionLimit,
  currencyName,
  showTooltip,
}: {
  distributionLimit: BigNumber | undefined
  currencyName: CurrencyName | undefined
  showTooltip?: boolean
}) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const distributionLimitIsInfinite = distributionLimit?.eq(
    MAX_DISTRIBUTION_LIMIT,
  )
  const distributionLimitIsZero = distributionLimit?.eq(0)

  const _tooltip = showTooltip ? (
    <TooltipIcon
      tip={
        distributionLimitIsInfinite ? (
          <Trans>
            All funds received by the treasury will be distributed. Token
            holders will receive <strong>no ETH</strong> when burning their
            tokens.
          </Trans>
        ) : distributionLimitIsZero ? (
          <Trans>
            No funds can be distributed out of the treasury. Funds can only be
            accessed by token holders redeeming their tokens.
          </Trans>
        ) : (
          <Trans>
            If you don't raise this amount, your splits will receive their
            percentage of whatever you raise.
          </Trans>
        )
      }
      placement={'topLeft'}
      iconStyle={{ marginLeft: 5 }}
    />
  ) : null

  const _text = distributionLimitIsInfinite ? (
    <Trans>No limit (infinite)</Trans>
  ) : distributionLimitIsZero ? (
    <Trans>Zero</Trans>
  ) : (
    <>
      <CurrencySymbol currency={currencyName} />
      {formatWad(distributionLimit)}
    </>
  )

  return (
    <span style={{ color: colors.text.primary }}>
      {_text}
      {_tooltip}
    </span>
  )
}
