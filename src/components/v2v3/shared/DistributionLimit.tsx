import { Trans } from '@lingui/macro'
import TooltipIcon from 'components/TooltipIcon'
import { CurrencyName } from 'constants/currency'
import { BigNumber } from 'ethers'
import { twMerge } from 'tailwind-merge'
import { formatFundingTarget } from 'utils/format/formatFundingTarget'
import { getV2V3CurrencyOption } from 'utils/v2v3/currency'
import { isInfiniteDistributionLimit } from 'utils/v2v3/fundingCycle'

export default function DistributionLimit({
  className,
  distributionLimit,
  currencyName,
  showTooltip,
  shortName,
}: {
  className?: string
  distributionLimit: BigNumber | undefined
  currencyName: CurrencyName | undefined
  showTooltip?: boolean
  shortName?: boolean
}) {
  const distributionLimitIsInfinite =
    !distributionLimit || isInfiniteDistributionLimit(distributionLimit)
  const distributionLimitIsZero = distributionLimit?.eq(0)
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
