import { CrownFilled } from '@ant-design/icons'
import { t, Trans } from '@lingui/macro'
import { Space, Tooltip } from 'antd'
import CurrencySymbol from 'components/CurrencySymbol'
import Balance from 'components/Navbar/Balance'
import TooltipLabel from 'components/TooltipLabel'
import { ThemeContext } from 'contexts/themeContext'
import { CSSProperties, useContext } from 'react'
import { formatWad } from 'utils/format/formatNumber'

import { BigNumber } from '@ethersproject/bignumber'
import { MAX_DISTRIBUTION_LIMIT } from 'utils/v2/math'

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
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const smallHeaderStyle: CSSProperties = {
    fontSize: '.7rem',
    fontWeight: 500,
    cursor: 'default',
    color: colors.text.secondary,
  }

  const formattedDistributionLimit = !targetAmount.eq(MAX_DISTRIBUTION_LIMIT)
    ? formatWad(targetAmount, { precision: 4 })
    : t`NO LIMIT`

  return (
    <div>
      <div>
        <Tooltip
          title={
            currency === 'ETH' ? (
              <ETHToUSD ethAmount={distributableAmount ?? ''} />
            ) : undefined
          }
        >
          <span
            style={{
              fontSize: '1rem',
              fontWeight: 500,
            }}
          >
            <CurrencySymbol currency={currency} />
            {formatWad(distributableAmount, { precision: 4 }) || '0'}{' '}
          </span>
        </Tooltip>
        <TooltipLabel
          style={smallHeaderStyle}
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

      <div style={{ ...smallHeaderStyle, color: colors.text.tertiary }}>
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
