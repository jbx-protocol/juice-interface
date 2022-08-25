import { BigNumber } from '@ethersproject/bignumber'
import { Trans } from '@lingui/macro'
import ETHAmount from 'components/currency/ETHAmount'
import StatLine from 'components/Project/StatLine'
import { ThemeContext } from 'contexts/themeContext'
import { V2ProjectContext } from 'contexts/v2/projectContext'
import { CSSProperties, useContext } from 'react'
import { NO_CURRENCY, V2_CURRENCY_USD } from 'utils/v2/currency'

import V2CurrencyAmount from 'components/v2/shared/V2CurrencyAmount'

import { textPrimary, textSecondary } from 'constants/styles/text'

export default function ProjectBalance({ style }: { style?: CSSProperties }) {
  const { theme } = useContext(ThemeContext)
  const { colors } = theme
  const {
    ETHBalance,
    balanceInDistributionLimitCurrency,
    distributionLimitCurrency,
    loading: { balanceInDistributionLimitCurrencyLoading },
  } = useContext(V2ProjectContext)

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
          {distributionLimitCurrency?.eq(V2_CURRENCY_USD) && (
            <span style={textSecondary(theme)} className="text-sm">
              <ETHAmount amount={ETHBalance} padEnd />{' '}
            </span>
          )}
          <V2CurrencyAmount
            amount={balanceInDistributionLimitCurrency ?? BigNumber.from(0)}
            currency={distributionLimitCurrency ?? BigNumber.from(NO_CURRENCY)}
          />
        </div>
      }
      style={style}
    />
  )
}
