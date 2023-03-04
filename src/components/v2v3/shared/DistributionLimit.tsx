import { BigNumber } from '@ethersproject/bignumber'
import { Trans } from '@lingui/macro'
import ETHAmount from 'components/currency/ETHAmount'
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
            All of this project's ETH will be paid out. Token holders will
            receive <strong>no ETH</strong> when redeeming their tokens.
          </Trans>
        ) : distributionLimitIsZero ? (
          <Trans>
            No ETH can be paid out from the project. The ETH can only be
            accessed by token holders that redeem their tokens.
          </Trans>
        ) : (
          <Trans>
            If you don't raise this amount, your payout recipients will receive
            their percentage of the available ETH.
          </Trans>
        )
      }
      placement={'topLeft'}
      iconClassName="ml-1"
    />
  ) : null

  const _text = distributionLimitIsInfinite ? (
    <Trans>Infinite (all available ETH)</Trans>
  ) : distributionLimitIsZero ? (
    <Trans>Zero (no payouts)</Trans>
  ) : (
    <>
      {currencyName === 'ETH' ? (
        <ETHAmount amount={distributionLimit} />
      ) : (
        <>
          <CurrencySymbol currency={currencyName} />
          {formatWad(distributionLimit)}
        </>
      )}
    </>
  )

  return (
    <span className={twMerge(className, 'text-black dark:text-slate-100')}>
      {_text}
      {_tooltip}
    </span>
  )
}
