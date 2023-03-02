import { BigNumber } from '@ethersproject/bignumber'
import { Trans } from '@lingui/macro'
import ETHAmount from 'components/currency/ETHAmount'
import StatLine from 'components/Project/StatLine'
import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import { useContext } from 'react'
import { NO_CURRENCY, V2V3_CURRENCY_USD } from 'utils/v2v3/currency'

import V2V3CurrencyAmount from 'components/v2v3/shared/V2V3CurrencyAmount'

export default function ProjectBalance() {
  const {
    ETHBalance,
    balanceInDistributionLimitCurrency,
    distributionLimitCurrency,
    loading: { balanceInDistributionLimitCurrencyLoading },
  } = useContext(V2V3ProjectContext)

  return (
    <StatLine
      loading={balanceInDistributionLimitCurrencyLoading}
      statLabel={<Trans>Current balance</Trans>}
      statLabelTip={
        <Trans>The amount of ETH that this project has right now.</Trans>
      }
      statValue={
        <div className="ml-2 text-lg font-medium text-juice-400 dark:text-juice-300">
          {distributionLimitCurrency?.eq(V2V3_CURRENCY_USD) && (
            <span className="text-sm font-medium uppercase text-grey-400 dark:text-slate-200">
              <ETHAmount amount={ETHBalance} padEnd />{' '}
            </span>
          )}
          <V2V3CurrencyAmount
            amount={balanceInDistributionLimitCurrency ?? BigNumber.from(0)}
            currency={distributionLimitCurrency ?? BigNumber.from(NO_CURRENCY)}
          />
        </div>
      }
    />
  )
}
