import { DiffedItem } from '../../DiffedItem'
import { SplitProps } from '../../SplitItem'
import { SplitAmountValue } from '../../SplitItem/SplitAmountValue'

export function DiffedSplitAmount({
  newSplitProps,
  oldSplitProps,
}: {
  newSplitProps: SplitProps
  oldSplitProps: SplitProps | undefined
}) {
  if (!oldSplitProps?.split.percent) {
    return <SplitAmountValue props={newSplitProps} />
  } else if (!newSplitProps.split.percent) {
    return <SplitAmountValue props={oldSplitProps} />
  }

  return (
    <div className="grid grid-cols-2">
      {oldSplitProps ? (
        <DiffedItem
          value={<SplitAmountValue props={oldSplitProps} />}
          diffStatus="old"
          hideIcon
        />
      ) : null}
      <DiffedItem
        value={<SplitAmountValue props={newSplitProps} />}
        diffStatus="new"
        hideIcon
      />
    </div>
  )
}
