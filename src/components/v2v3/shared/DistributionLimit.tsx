import { BigNumber } from '@ethersproject/bignumber'
import { Trans } from '@lingui/macro'
import CurrencySymbol from 'components/CurrencySymbol'
import TooltipIcon from 'components/TooltipIcon'
import { CurrencyName } from 'constants/currency'
import { twMerge } from 'tailwind-merge'
import { formatWad } from 'utils/format/formatNumber'
import { MAX_DISTRIBUTION_LIMIT } from 'utils/v2v3/math'

export default function DistributionLimit({
  className,
  distributionLimit,
  currencyName,
  showTooltip,
}: {
  className?: string
  distributionLimit: BigNumber | undefined
  currencyName: CurrencyName | undefined
  showTooltip?: boolean
}) {
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
      iconClassName="ml-1"
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
    <span className={twMerge(className, 'text-black dark:text-slate-100')}>
      {_text}
      {_tooltip}
    </span>
  )
}
