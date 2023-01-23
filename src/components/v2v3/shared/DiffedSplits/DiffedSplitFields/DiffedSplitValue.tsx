import { Split } from 'models/splits'
import { DiffedSplitPercent } from './DiffedSplitPercent'
import { SplitProps } from '../../SplitItem'
import { SplitAmountValue } from '../../SplitItem/SplitAmountValue'

export function DiffedSplitValue({
  splitProps,
  diffSplit,
}: {
  splitProps: SplitProps
  diffSplit?: Split
}) {
  return (
    <div className="flex">
      <DiffedSplitPercent
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
