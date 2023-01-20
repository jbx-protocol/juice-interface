import { SplitPercentValue } from './SplitPercentValue'
import { SplitAmountValue } from './SplitAmountValue'
import { SplitProps } from './SplitItem'

export function SplitValue({ splitProps }: { splitProps: SplitProps }) {
  return (
    <div className="flex">
      <SplitPercentValue percent={splitProps.split.percent} />
      {splitProps.showAmount && splitProps.totalValue?.gt(0) ? (
        <div className="ml-1">
          <SplitAmountValue props={splitProps} />
        </div>
      ) : null}
    </div>
  )
}
