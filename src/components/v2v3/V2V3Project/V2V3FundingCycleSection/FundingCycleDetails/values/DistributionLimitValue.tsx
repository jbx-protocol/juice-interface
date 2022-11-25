import { Tooltip } from 'antd'
import ETHToUSD from 'components/currency/ETHToUSD'
import DistributionLimit from 'components/v2v3/shared/DistributionLimit'
import { CurrencyName } from 'constants/currency'
import { ThemeContext } from 'contexts/themeContext'
import { BigNumber } from '@ethersproject/bignumber'
import { useContext } from 'react'

export function DistributionLimitValue({
  distributionLimit,
  currency,
}: {
  distributionLimit: BigNumber | undefined
  currency: CurrencyName | undefined
}) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)
  return (
    <span style={{ whiteSpace: 'nowrap' }}>
      <Tooltip
        title={
          currency === 'ETH' && distributionLimit?.gt(0) ? (
            <ETHToUSD ethAmount={distributionLimit} />
          ) : undefined
        }
      >
        {''}
        <DistributionLimit
          distributionLimit={distributionLimit}
          currencyName={currency}
          style={{ color: colors.text.secondary }}
        />
      </Tooltip>
    </span>
  )
}
