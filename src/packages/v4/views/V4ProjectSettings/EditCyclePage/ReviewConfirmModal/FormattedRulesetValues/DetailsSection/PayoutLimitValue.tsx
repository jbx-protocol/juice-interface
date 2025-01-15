import { Trans } from '@lingui/macro'
import TooltipIcon from 'components/TooltipIcon'
import { CurrencyName } from 'constants/currency'
import { NativeTokenValue } from 'juice-sdk-react'
import { isInfinitePayoutLimit } from 'packages/v4/utils/fundingCycle'

export function PayoutLimitValue({
  payoutLimit,
  currencyName,
  shortName,
}: {
  payoutLimit: bigint | undefined
  currencyName: CurrencyName | undefined
  shortName?: boolean
}) {
  const distributionLimitIsInfinite =
    !payoutLimit || isInfinitePayoutLimit(payoutLimit)
  const distributionLimitIsZero = payoutLimit === 0n
  // const distributionLimitCurrency = currencyName
  //   ? getV4CurrencyOption(currencyName)
  //   : undefined

  const _tooltip = (
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
            accessed by token holders that cash out their tokens.
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
  )

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
    <NativeTokenValue wei={payoutLimit} />
  )

  return (
    <span className="text-grey-900 dark:text-slate-100">
      {_text}
      {_tooltip}
    </span>
  )
}
