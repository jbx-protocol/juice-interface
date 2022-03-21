import { Trans } from '@lingui/macro'
import ETHAmount from 'components/shared/currency/ETHAmount'
import StatLine from 'components/shared/Project/StatLine'
import { ThemeContext } from 'contexts/themeContext'
import { BigNumber } from '@ethersproject/bignumber'
import { CSSProperties, useContext } from 'react'
import { V2_CURRENCY_ETH, V2_CURRENCY_USD } from 'utils/v2/currency'
import { V2ProjectContext } from 'contexts/v2/projectContext'
import USDAmount from 'components/shared/currency/USDAmount'

export default function TreasuryStats() {
  const {
    theme: { colors },
  } = useContext(ThemeContext)
  const {
    ETHBalance,
    balanceInDistributionLimitCurrency,
    distributionLimitCurrency,
  } = useContext(V2ProjectContext)

  const spacing = 10

  const primaryTextStyle: CSSProperties = {
    fontWeight: 500,
    fontSize: '1.1rem',
    lineHeight: 1,
  }
  const secondaryTextStyle: CSSProperties = {
    textTransform: 'uppercase',
    color: colors.text.tertiary,
    fontSize: '0.8rem',
    fontWeight: 500,
  }

  const formatCurrencyAmount = (amt: BigNumber | undefined) => {
    if (!amt) return null

    if (distributionLimitCurrency?.eq(V2_CURRENCY_ETH)) {
      return <ETHAmount amount={amt} precision={2} padEnd />
    }

    if (distributionLimitCurrency?.eq(V2_CURRENCY_USD)) {
      return <USDAmount amount={amt} precision={2} padEnd />
    }

    return null
  }

  return (
    <StatLine
      statLabel={<Trans>In Juicebox</Trans>}
      statLabelTip={
        <Trans>The balance of this project in the Juicebox contract.</Trans>
      }
      statValue={
        <div
          style={{
            ...primaryTextStyle,
            color: colors.text.brand.primary,
            marginLeft: 10,
          }}
        >
          {distributionLimitCurrency?.eq(V2_CURRENCY_USD) ? (
            <span style={secondaryTextStyle}>
              <ETHAmount amount={ETHBalance} precision={2} padEnd={true} />{' '}
            </span>
          ) : (
            ''
          )}
          {formatCurrencyAmount(balanceInDistributionLimitCurrency)}
        </div>
      }
      style={{ marginBottom: spacing }}
    />
  )
}
