import { Trans } from '@lingui/macro'
import { AllocationSplit } from 'components/Allocation'
import { Callout } from 'components/Callout'
import { ReservedTokensList } from 'components/Create/components/pages/ProjectToken/components/CustomTokenSettings/components/ReservedTokensList'
import { CsvUpload } from 'components/inputs/CsvUpload'
import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import { Split } from 'models/splits'
import { useCallback, useContext, useEffect } from 'react'
import { parseV2SplitsCsv } from 'utils/csv'
import { allocationToSplit, splitToAllocation } from 'utils/splitToAllocation'

export function V2V3EditReservedTokens({
  editingReservedTokensSplits,
  setEditingReservedTokensSplits,
}: {
  editingReservedTokensSplits: Split[]
  setEditingReservedTokensSplits: (splits: Split[]) => void
}) {
  const { reservedTokensSplits } = useContext(V2V3ProjectContext)

  useEffect(() => {
    if (!reservedTokensSplits) return
    setEditingReservedTokensSplits(reservedTokensSplits)
  }, [reservedTokensSplits, setEditingReservedTokensSplits])

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
      <Callout.Info className="mb-4">
        <Trans>
          Changes to your reserved token recipients will take effect
          immediately.
        </Trans>
      </Callout.Info>
      <div className="flex min-h-0 flex-col gap-4">
        <div className="flex justify-between">
          <Trans>Reserved token recipients</Trans>
          <CsvUpload
            onChange={onSplitsChanged}
            templateUrl={'/assets/csv/v2-splits-template.csv'}
            parser={parseV2SplitsCsv}
          />
        </div>
        <ReservedTokensList
          onChange={onAllocationChanged}
          value={editingReservedTokensSplits.map(splitToAllocation)}
        />
      </div>
    </>
  )
}
