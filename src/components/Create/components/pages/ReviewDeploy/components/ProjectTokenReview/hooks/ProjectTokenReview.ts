import { AllocationSplit } from 'components/Allocation'
import { allocationToSplit, splitToAllocation } from 'utils/splitToAllocation'
import { useAppSelector } from 'hooks/AppSelector'
import { useCallback, useMemo } from 'react'
import { useEditingReservedTokensSplits } from 'redux/hooks/EditingReservedTokensSplits'
import { formatEnabled } from 'utils/format/formatBoolean'

export const useProjectTokenReview = () => {
  const {
    fundingCycleData: { weight, discountRate },
    fundingCycleMetadata: { allowMinting, reservedRate, redemptionRate },
  } = useAppSelector(state => state.editingV2Project)
  const [tokenSplits, setTokenSplits] = useEditingReservedTokensSplits()

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

  return {
    weight,
    discountRate,
    allowTokenMinting,
    reservedRate,
    redemptionRate,
    allocationSplits,
    setAllocationSplits,
  }
}
