import { SplitAmountValue } from './SplitAmountValue'
import { SplitProps } from './SplitItem'
import { SplitPercentValue } from './SplitPercentValue'

export function SplitValue({ splitProps }: { splitProps: SplitProps }) {
  return (
    <div className="text-primary flex items-center">
      <SplitPercentValue percent={splitProps.split.percent} />
      {splitProps.showAmount && splitProps.totalValue?.gt(0) ? (
        <div className="ml-1 flex items-center">
          <SplitAmountValue props={splitProps} />
        </div>
      ) : null}
    </div>
  )
}
