import { Trans } from '@lingui/macro'
import { Callout } from 'components/Callout/Callout'
import { CsvUpload } from 'components/inputs/CsvUpload'
import { AllocationSplit } from 'components/v2v3/shared/Allocation/Allocation'
import { ReservedTokensList } from 'components/v2v3/shared/ReservedTokensList'
import { Split } from 'models/splits'
import { useCallback } from 'react'
import { parseV2SplitsCsv } from 'utils/csv'
import { allocationToSplit, splitToAllocation } from 'utils/splitToAllocation'

export function V2V3EditReservedTokens({
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
        <div className="flex justify-between">
          {hideTitle ? <div /> : <Trans>Reserved token recipients</Trans>}
          <CsvUpload
            onChange={onSplitsChanged}
            templateUrl={'/assets/csv/v2-splits-template.csv'}
            parser={parseV2SplitsCsv}
          />
        </div>
        <ReservedTokensList
          onChange={onAllocationChanged}
          value={editingReservedTokensSplits.map(splitToAllocation)}
          isEditable
        />
      </div>
    </>
  )
}
