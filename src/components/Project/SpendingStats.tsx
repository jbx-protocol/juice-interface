import { CrownFilled } from '@ant-design/icons'
import { t, Trans } from '@lingui/macro'
import { Space, Tooltip } from 'antd'
import CurrencySymbol from 'components/CurrencySymbol'
import Balance from 'components/Navbar/Balance'
import TooltipLabel from 'components/TooltipLabel'
import { formatWad } from 'utils/format/formatNumber'

import { BigNumber } from '@ethersproject/bignumber'
import { MAX_DISTRIBUTION_LIMIT } from 'utils/v2v3/math'

import ETHToUSD from 'components/currency/ETHToUSD'
import { CurrencyName } from 'constants/currency'

export default function SpendingStats({
  currency,
  targetAmount,
  distributedAmount,
  distributableAmount,
  ownerAddress,
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
  const formattedDistributionLimit = !targetAmount.eq(MAX_DISTRIBUTION_LIMIT)
    ? formatWad(targetAmount, { precision: 4 })
    : t`NO LIMIT`

  return (
    <div>
      <div>
        <Tooltip
          title={
            currency === 'ETH' && distributableAmount?.gt(0) ? (
              <ETHToUSD ethAmount={distributableAmount} />
            ) : undefined
          }
        >
          <span className="text-base font-medium">
            <CurrencySymbol currency={currency} />
            {formatWad(distributableAmount, { precision: 4 }) || '0'}{' '}
          </span>
        </Tooltip>
        <TooltipLabel
          className="cursor-default text-xs font-medium text-grey-900 dark:text-slate-100"
          label={<Trans>AVAILABLE</Trans>}
          tip={
            <Trans>
              Funds available to distribute in this funding cycle (before the{' '}
              {feePercentage}% JBX fee). This amount won't roll over to the next
              funding cycle, so funds should be distributed before this funding
              cycle ends.
            </Trans>
          }
        />
      </div>

      <div className="cursor-default text-sm font-medium text-grey-500 dark:text-slate-200">
        <div>
          <Trans>
            <CurrencySymbol currency={currency} />
            {formatWad(distributedAmount, { precision: 4 }) || '0'}
            {hasFundingTarget ? (
              <span>/{formattedDistributionLimit} </span>
            ) : null}{' '}
            distributed
          </Trans>
        </div>

        <div>
          <Space>
            <Balance address={ownerAddress} />
            <Tooltip
              className="text-grey-400 dark:text-slate-200"
              title={<Trans>Balance of the project owner's wallet.</Trans>}
            >
              <span>
                <Trans>
                  <CrownFilled /> owner balance
                </Trans>
              </span>
            </Tooltip>
          </Space>
        </div>
      </div>
    </div>
  )
}
