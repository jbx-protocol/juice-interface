import { SplitPercentValue } from './SplitPercentValue'
import { SplitAmountValue } from './SplitAmountValue'
import { BigNumber } from '@ethersproject/bignumber'
import { Split } from 'models/splits'
import { DiffedItem } from 'components/v2v3/V2V3Project/V2V3FundingCycleSection/FundingCycleDetails/DiffedItem'

export function SplitValue({
  split,
  oldSplit,
  totalValue,
  valueSuffix,
  valueFormatProps,
  currency,
  showFees = false,
}: {
  split: Split
  oldSplit?: Split
  totalValue: BigNumber | undefined
  valueSuffix?: string | JSX.Element
  valueFormatProps?: { precision?: number }
  currency?: BigNumber
  showFees?: boolean
}) {
  function Values({ split }: { split: Split }) {
    return (
      <>
        <SplitPercentValue percent={split.percent} />
        {totalValue?.gt(0) ? (
          <div className="ml-1">
            {' '}
            <SplitAmountValue
              split={split}
              totalValue={totalValue}
              valueSuffix={valueSuffix}
              valueFormatProps={valueFormatProps}
              currency={currency}
              showFees={showFees}
            />
          </div>
        ) : null}
      </>
    )
  }
  const hasDiff = oldSplit && oldSplit.percent !== split.percent
  if (!hasDiff) return <Values split={split} />
  return (
    <div className="flex">
      <DiffedItem value={<Values split={oldSplit} />} diffStatus="old" />
      <DiffedItem value={<Values split={split} />} diffStatus="new" />
    </div>
  )
}
