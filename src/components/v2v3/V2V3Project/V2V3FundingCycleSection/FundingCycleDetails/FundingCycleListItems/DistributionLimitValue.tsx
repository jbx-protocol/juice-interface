import { Tooltip } from 'antd'
import ETHToUSD from 'components/currency/ETHToUSD'
import DistributionLimit from 'components/v2v3/shared/DistributionLimit'
import { CurrencyName } from 'constants/currency'
import { BigNumber } from 'ethers'

export function DistributionLimitValue({
  distributionLimit,
  currency,
}: {
  distributionLimit: BigNumber | undefined
  currency: CurrencyName | undefined
}) {
  return (
    <span className="whitespace-nowrap">
      <Tooltip
        title={
          currency === 'ETH' && distributionLimit?.gt(0) ? (
            <ETHToUSD ethAmount={distributionLimit} />
          ) : undefined
        }
      >
        <DistributionLimit
          distributionLimit={distributionLimit}
          currencyName={currency}
          className="text-grey-900 dark:text-slate-100"
        />
      </Tooltip>
    </span>
  )
}
