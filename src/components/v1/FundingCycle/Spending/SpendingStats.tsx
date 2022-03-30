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
  withdrawnAmount,
  projectBalanceInCurrency,
  ownerAddress,
  feePercentage,
  hasFundingTarget,
}: {
  currency: CurrencyName | undefined
  targetAmount: BigNumber | undefined
  withdrawnAmount: BigNumber | undefined
  projectBalanceInCurrency: BigNumber | undefined
  ownerAddress: string | undefined
  feePercentage: string | undefined
  hasFundingTarget: boolean | undefined
}) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  if (!targetAmount || !withdrawnAmount) return <span>Loading...</span>

  const untapped = targetAmount.sub(withdrawnAmount)

  const withdrawable = projectBalanceInCurrency?.gt(untapped)
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
          {formatWad(withdrawable, { precision: 4 }) || '0'}{' '}
        </span>
        <TooltipLabel
          style={smallHeaderStyle}
          label={<Trans>AVAILABLE</Trans>}
          tip={
            <Trans>
              The funds available to withdraw for this funding cycle after the $
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
            {formatWad(withdrawnAmount, { precision: 4 }) || '0'}
            {hasFundingTarget ? (
              <span>/{formatWad(targetAmount, { precision: 4 })} </span>
            ) : null}{' '}
            withdrawn
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
