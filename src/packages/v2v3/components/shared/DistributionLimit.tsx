import { Trans } from '@lingui/macro'
import TooltipIcon from 'components/TooltipIcon'
import { CurrencyName } from 'constants/currency'
import { getV2V3CurrencyOption } from 'packages/v2v3/utils/currency'
import { isInfiniteDistributionLimit } from 'packages/v2v3/utils/fundingCycle'
import { twMerge } from 'tailwind-merge'
import { formatFundingTarget } from 'utils/format/formatFundingTarget'

export default function DistributionLimit({
  className,
  distributionLimit,
  currencyName,
  showTooltip,
  shortName,
}: {
  className?: string
  distributionLimit: bigint | undefined
  currencyName: CurrencyName | undefined
  showTooltip?: boolean
  shortName?: boolean
}) {
  const distributionLimitIsInfinite =
    isInfiniteDistributionLimit(distributionLimit)
  const distributionLimitIsZero = distributionLimit === 0n
  const distributionLimitCurrency = currencyName
    ? getV2V3CurrencyOption(currencyName)
    : undefined

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
    <>
      {shortName ? (
        <Trans>No limit</Trans>
      ) : (
        <Trans>No limit (all available ETH)</Trans>
      )}
    </>
  ) : distributionLimitIsZero ? (
    <>{shortName ? <Trans>Zero</Trans> : <Trans>Zero (no payouts)</Trans>}</>
  ) : (
    <>
      {formatFundingTarget({
        distributionLimitWad: distributionLimit,
        distributionLimitCurrency: distributionLimitCurrency,
      })}
    </>
  )

  return (
    <span className={twMerge(className, 'text-black dark:text-slate-100')}>
      {_text}
      {_tooltip}
    </span>
  )
}
