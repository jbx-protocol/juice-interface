import { Trans } from '@lingui/macro'
import { Callout } from 'components/Callout/Callout'
import { JBSplit as Split } from 'juice-sdk-core'
import { useCallback } from 'react'
import { allocationToSplit, splitToAllocation } from '../utils/splitToAllocation'
import { AllocationSplit } from './Allocation/Allocation'
import { ReservedTokensList } from './ReservedTokensList'

export function V4EditReservedTokens({
  editingReservedTokensSplits,
  setEditingReservedTokensSplits,
  showInstantChangesCallout,
  hideTitle,
}: {
  editingReservedTokensSplits: Split[]
  setEditingReservedTokensSplits: (splits: Split[]) => void
  showInstantChangesCallout?: boolean
  hideTitle?: boolean
}) {
  const onSplitsChanged = useCallback(
    (newSplits: Split[]) => {
      setEditingReservedTokensSplits(newSplits)
    },
    [setEditingReservedTokensSplits],
  )

  const onAllocationChanged = (newAllocations: AllocationSplit[]) => {
    onSplitsChanged(newAllocations.map(allocationToSplit))
  }

  return (
    <>
      {showInstantChangesCallout ? (
        <Callout.Info className="mb-4">
          <Trans>
            Changes to your reserved token recipients will take effect
            immediately.
          </Trans>
        </Callout.Info>
      ) : null}
      <div className="flex min-h-0 flex-col gap-4">
        {/* <div className="flex justify-between">
          {hideTitle ? <div /> : <Trans>Reserved token recipients</Trans>}
          <CsvUpload
            onChange={onSplitsChanged}
            templateUrl={'/assets/csv/v2-splits-template.csv'}
            parser={parseV4SplitsCsv}
          />
        </div> */}
        <ReservedTokensList
          onChange={onAllocationChanged}
          value={editingReservedTokensSplits.map(splitToAllocation)}
          isEditable
        />
      </div>
    </>
  )
}
