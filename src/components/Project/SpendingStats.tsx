import { t, Trans } from '@lingui/macro'
import { Tooltip } from 'antd'
import { AmountInCurrency } from 'components/currency/AmountInCurrency'
import ETHToUSD from 'components/currency/ETHToUSD'
import TooltipLabel from 'components/TooltipLabel'
import { CurrencyName } from 'constants/currency'
import { BigNumber } from 'ethers'
import { formatWad } from 'utils/format/formatNumber'
import { isInfiniteDistributionLimit } from 'utils/v2v3/fundingCycle'

export default function SpendingStats({
  currency,
  targetAmount,
  distributedAmount,
  distributableAmount,
  feePercentage,
  hasFundingTarget,
}: {
  currency: CurrencyName | undefined
  targetAmount: BigNumber
  distributedAmount: BigNumber
  distributableAmount: BigNumber | undefined
  ownerAddress: string | undefined
  feePercentage: string | undefined
  hasFundingTarget: boolean | undefined
}) {
  const formattedDistributionLimit = isInfiniteDistributionLimit(targetAmount)
    ? t`NO LIMIT`
    : formatWad(targetAmount, { precision: 4 })

  return (
    <div>
      <div className="mb-1 flex gap-x-1">
        <Tooltip
          title={
            currency === 'ETH' && distributableAmount?.gt(0) ? (
              <ETHToUSD ethAmount={distributableAmount} />
            ) : undefined
          }
        >
          <span className="text-base font-medium">
            <AmountInCurrency
              amount={distributableAmount}
              currency={currency}
            />{' '}
          </span>
        </Tooltip>
        <TooltipLabel
          className="cursor-default text-xs font-medium text-grey-500 dark:text-slate-100"
          label={<Trans>AVAILABLE</Trans>}
          tip={
            <Trans>
              ETH currently available to send to the payout recipients below
              (before the {feePercentage}% JBX fee). These payouts won't roll
              over to next cycle, so they must be sent out before then.
            </Trans>
          }
        />
      </div>

      <div className="cursor-default text-xs font-medium text-grey-500 dark:text-slate-100">
        <Trans>
          <AmountInCurrency amount={distributedAmount} currency={currency} />
          {hasFundingTarget ? (
            <span>/{formattedDistributionLimit}</span>
          ) : null}{' '}
          distributed
        </Trans>
      </div>
    </div>
  )
}
