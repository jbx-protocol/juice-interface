import { AllocationSplit } from 'packages/v2v3/components/shared/Allocation/Allocation'
import {
    allocationToSplit,
    splitToAllocation,
} from 'packages/v2v3/utils/splitToAllocation'
import { useCallback, useMemo } from 'react'
import { useAppSelector } from 'redux/hooks/useAppSelector'
import { useCreatingReservedTokensSplits } from 'redux/hooks/v2v3/create'
import { formatEnabled, formatPaused } from 'utils/format/formatBoolean'

export const useProjectTokenReview = () => {
  const {
    fundingCycleData: { weight, discountRate },
    fundingCycleMetadata: {
      allowMinting,
      reservedRate,
      cashOutTaxRate,
      global,
    },
  } = useAppSelector(state => state.creatingV2Project)
  const [tokenSplits, setTokenSplits] = useCreatingReservedTokensSplits()

  const allocationSplits = useMemo(
    () => tokenSplits.map(splitToAllocation),
    [tokenSplits],
  )
  const setAllocationSplits = useCallback(
    (allocations: AllocationSplit[]) =>
      setTokenSplits(allocations.map(allocationToSplit)),
    [setTokenSplits],
  )

  const allowTokenMinting = useMemo(
    () => formatEnabled(allowMinting),
    [allowMinting],
  )

  const pauseTransfers = useMemo(
    () => formatPaused(global.pauseTransfers),
    [global.pauseTransfers],
  )

  return {
    weight,
    discountRate,
    allowTokenMinting,
    pauseTransfers,
    reservedRate,
    cashOutTaxRate,
    allocationSplits,
    setAllocationSplits,
  }
}
