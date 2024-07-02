import { Tooltip } from 'antd'
import ETHToUSD from 'components/currency/ETHToUSD'
import DistributionLimit from 'components/v2v3/shared/DistributionLimit'
import { CurrencyName } from 'constants/currency'

export function DistributionLimitValue({
  distributionLimit,
  currency,
  shortName,
}: {
  distributionLimit: bigint | undefined
  currency: CurrencyName | undefined
  shortName?: boolean
}) {
  return (
    <span className="whitespace-nowrap">
      <Tooltip
        title={
          currency === 'ETH' && distributionLimit && distributionLimit > 0n ? (
            <ETHToUSD ethAmount={distributionLimit} />
          ) : undefined
        }
      >
        <DistributionLimit
          distributionLimit={distributionLimit}
          currencyName={currency}
          className="text-grey-900 dark:text-slate-100"
          shortName={shortName}
        />
      </Tooltip>
    </span>
  )
}
