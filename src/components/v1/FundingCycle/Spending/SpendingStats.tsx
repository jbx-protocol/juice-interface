import { Trans } from '@lingui/macro'
import { Space, Tooltip } from 'antd'
import Balance from 'components/Navbar/Balance'
import CurrencySymbol from 'components/shared/CurrencySymbol'
import TooltipLabel from 'components/shared/TooltipLabel'
import { formatWad, perbicentToPercent } from 'utils/formatNumber'
import { CrownFilled } from '@ant-design/icons'
import { hasFundingTarget } from 'utils/v1/fundingCycle'
import { CSSProperties, useContext } from 'react'
import { ThemeContext } from 'contexts/themeContext'
import { V1ProjectContext } from 'contexts/v1/projectContext'
import { V1CurrencyName } from 'utils/v1/currency'
import { V1CurrencyOption } from 'models/v1/currencyOption'

export default function SpendingStats() {
  const {
    theme: { colors },
  } = useContext(ThemeContext)
  const { balanceInCurrency, owner, currentFC } = useContext(V1ProjectContext)

  if (!currentFC) return null

  const currentFCCurrency = V1CurrencyName(
    currentFC.currency.toNumber() as V1CurrencyOption,
  )

  const untapped = currentFC.target.sub(currentFC.tapped)

  const withdrawable = balanceInCurrency?.gt(untapped)
    ? untapped
    : balanceInCurrency

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
          <CurrencySymbol currency={currentFCCurrency} />
          {formatWad(withdrawable, { precision: 4 }) || '0'}{' '}
        </span>
        <TooltipLabel
          style={smallHeaderStyle}
          label={<Trans>AVAILABLE</Trans>}
          tip={
            <Trans>
              The funds available to withdraw for this funding cycle after the $
              {perbicentToPercent(currentFC.fee)}% JBX fee is subtracted. This
              number won't roll over to the next funding cycle, so funds should
              be withdrawn before it ends.
            </Trans>
          }
        />
      </div>

      <div style={{ ...smallHeaderStyle, color: colors.text.tertiary }}>
        <div>
          <Trans>
            <CurrencySymbol currency={currentFCCurrency} />
            {formatWad(currentFC.tapped, { precision: 4 }) || '0'}
            {hasFundingTarget(currentFC) ? (
              <span>/{formatWad(currentFC.target, { precision: 4 })} </span>
            ) : null}{' '}
            withdrawn
          </Trans>
        </div>

        <div>
          <Tooltip
            title={<Trans>Balance of the project owner's wallet.</Trans>}
          >
            <Space>
              <Balance address={owner} />
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
