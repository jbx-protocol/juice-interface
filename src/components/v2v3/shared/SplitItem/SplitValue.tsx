import { SplitPercentValue } from './SplitPercentValue'
import { SplitAmountValue } from './SplitAmountValue'
import { Split } from 'models/splits'
import { SplitProps } from './SplitItem'

export function SplitValue({
  splitProps,
  diffSplit,
}: {
  splitProps: SplitProps
  diffSplit: Split | undefined
}) {
  return (
    <div className="flex">
      <SplitPercentValue
        percent={splitProps.split.percent}
        oldPercent={diffSplit?.percent}
      />
      {splitProps.showAmount && splitProps.totalValue?.gt(0) ? (
        <div className="ml-1">
          <SplitAmountValue props={splitProps} />
        </div>
      ) : null}
    </div>
  )
}
