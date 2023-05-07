import { AllocationSplit } from 'components/v2v3/shared/Allocation'
import { BigNumber } from 'ethers'
import { useMemo } from 'react'
import { fromWad } from 'utils/format/formatNumber'
import { useFundingTargetType } from './useFundingTargetType'

/**
 * Hook to calculate the payout split amount percentage.
 *
 * Using the `allocations`, the id of the allocation (`allocationId) will
 * determine the `amount` and `percentage` of the `totalAllocationAmount`.
 *
 * If no `totalAllocationAmount` exists, only the percentage will be returned.
 */
export const usePayoutSplitAmountPercentage = ({
  allocationId,
  allocations,
  totalAllocationAmount,
}: {
  allocationId?: string
  allocations: AllocationSplit[]
  totalAllocationAmount?: BigNumber | undefined
}) => {
  const fundingTargetType = useFundingTargetType(totalAllocationAmount)
  const hasSpecificFundingTarget = fundingTargetType === 'specific'

  const totalUsedPercent = useMemo(
    () => allocations.map(a => a.percent).reduce((prev, acc) => prev + acc, 0),
    [allocations],
  )
  const ownerPercent = 100.0 - totalUsedPercent

  const amount = useMemo(() => {
    if (!hasSpecificFundingTarget || !totalAllocationAmount) return undefined
    if (!allocationId) {
      // If allocation is not passed, assume this is for owner
      return (parseFloat(fromWad(totalAllocationAmount)) * ownerPercent) / 100
    }

    const allocation = allocations.find(a => a.id === allocationId)
    if (!allocation) {
      console.warn(
        'Allocation id passed to usePayoutSplitAmountPercentage with no matching id in allocations',
        { allocationId, allocations },
      )
      return NaN
    }
    return (
      (allocation.percent * parseFloat(fromWad(totalAllocationAmount))) / 100
    )
  }, [
    allocationId,
    allocations,
    totalAllocationAmount,
    hasSpecificFundingTarget,
    ownerPercent,
  ])

  const percent = useMemo(() => {
    if (!allocationId) {
      // If allocation is not passed, assume this is for owner
      return ownerPercent
    }
    const allocation = allocations.find(a => a.id === allocationId)
    if (!allocation) {
      console.warn(
        'Allocation id passed to usePayoutSplitAmountPercentage with no matching id in allocations',
        { allocationId, allocations },
      )
      return NaN
    }
    return allocation.percent
  }, [allocationId, allocations, ownerPercent])

  return { amount, percent }
}
