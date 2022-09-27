import { BigNumber } from '@ethersproject/bignumber'
import { Trans } from '@lingui/macro'
import ETHAmount from 'components/currency/ETHAmount'
import StatLine from 'components/Project/StatLine'
import { ThemeContext } from 'contexts/themeContext'
import { V2V3ProjectContext } from 'contexts/v2v3/V2V3ProjectContext'
import { CSSProperties, useContext } from 'react'
import { NO_CURRENCY, V2V3_CURRENCY_USD } from 'utils/v2v3/currency'

import V2V3CurrencyAmount from 'components/v2v3/shared/V2V3CurrencyAmount'

import { textPrimary, textSecondary } from 'constants/styles/text'

export default function ProjectBalance({ style }: { style?: CSSProperties }) {
  const { theme } = useContext(ThemeContext)
  const { colors } = theme
  const {
    ETHBalance,
    balanceInDistributionLimitCurrency,
    distributionLimitCurrency,
    loading: { balanceInDistributionLimitCurrencyLoading },
  } = useContext(V2V3ProjectContext)

  return (
    <StatLine
      loading={balanceInDistributionLimitCurrencyLoading}
      statLabel={<Trans>In treasury</Trans>}
      statLabelTip={
        <Trans>This project's balance in the Juicebox contract.</Trans>
      }
      statValue={
        <div
          style={{
            ...textPrimary,
            color: colors.text.brand.primary,
            marginLeft: 10,
          }}
        >
          {distributionLimitCurrency?.eq(V2V3_CURRENCY_USD) && (
            <span style={textSecondary(theme)}>
              <ETHAmount amount={ETHBalance} padEnd />{' '}
            </span>
          )}
          <V2V3CurrencyAmount
            amount={balanceInDistributionLimitCurrency ?? BigNumber.from(0)}
            currency={distributionLimitCurrency ?? BigNumber.from(NO_CURRENCY)}
          />
        </div>
      }
      style={style}
    />
  )
}
