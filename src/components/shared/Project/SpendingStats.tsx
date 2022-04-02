import { Trans } from '@lingui/macro'
import { Space, Tooltip } from 'antd'
import Balance from 'components/Navbar/Balance'
import CurrencySymbol from 'components/shared/CurrencySymbol'
import TooltipLabel from 'components/shared/TooltipLabel'
import { formatWad } from 'utils/formatNumber'
import { CrownFilled } from '@ant-design/icons'
import { CSSProperties, useContext } from 'react'
import { ThemeContext } from 'contexts/themeContext'

import { BigNumber } from '@ethersproject/bignumber'

import { CurrencyName } from 'constants/currency'

export default function SpendingStats({
  currency,
  targetAmount,
  distributedAmount,
  projectBalanceInCurrency,
  ownerAddress,
  feePercentage,
  hasFundingTarget,
}: {
  currency: CurrencyName | undefined
  targetAmount: BigNumber | undefined
  distributedAmount: BigNumber | undefined
  projectBalanceInCurrency: BigNumber | undefined
  ownerAddress: string | undefined
  feePercentage: string | undefined
  hasFundingTarget: boolean | undefined
}) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  if (!targetAmount || !distributedAmount) return <span>Loading...</span>

  const untapped = targetAmount.sub(distributedAmount)

  const distributableAmount = projectBalanceInCurrency?.gt(untapped)
    ? untapped
    : projectBalanceInCurrency

  const smallHeaderStyle: CSSProperties = {
    fontSize: '.7rem',
    fontWeight: 500,
    cursor: 'default',
    color: colors.text.secondary,
  }

  return (
    <div>
      <div>
        <span
          style={{
            fontSize: '1rem',
            fontWeight: 500,
          }}
        >
          <CurrencySymbol currency={currency} />
          {formatWad(distributableAmount, { precision: 4 }) || '0'}{' '}
        </span>
        <TooltipLabel
          style={smallHeaderStyle}
          label={<Trans>AVAILABLE</Trans>}
          tip={
            <Trans>
              The funds available to withdraw for this funding cycle before the{' '}
              {feePercentage}% JBX fee is subtracted. This number won't roll
              over to the next funding cycle, so funds should be withdrawn
              before it ends.
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
              <span>/{formatWad(targetAmount, { precision: 4 })} </span>
            ) : null}{' '}
            distributed
          </Trans>
        </div>

        <div>
          <Tooltip
            title={<Trans>Balance of the project owner's wallet.</Trans>}
          >
            <Space>
              <Balance address={ownerAddress} />
              <Trans>
                <CrownFilled /> owner balance
              </Trans>
            </Space>
          </Tooltip>
        </div>
      </div>
    </div>
  )
}
