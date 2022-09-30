import { FormItemInput } from 'models/formItemInput'
import { useCallback, useState } from 'react'
import { AllocationSplit } from '../Allocation'

export const useAllocation = ({
  value,
  onChange,
}: FormItemInput<AllocationSplit[]>) => {
  const [_allocations, _setAllocations] = useState<AllocationSplit[]>([])
  const allocations = value ?? _allocations
  const setAllocations = onChange ?? _setAllocations

  const addAllocation = useCallback(
    (allocation: AllocationSplit) => {
      setAllocations([...allocations, allocation])
    },
    [allocations, setAllocations],
  )

  const removeAllocation = useCallback(
    (id: string) => {
      setAllocations(allocations.filter(a => a.id !== id))
    },
    [allocations, setAllocations],
  )

  const upsertAllocation = useCallback(
    (allocation: AllocationSplit) => {
      const index = allocations.findIndex(a => a.id === allocation.id)
      if (index < 0) {
        addAllocation(allocation)
        return
      }

      setAllocations([
        ...allocations.slice(0, index),
        allocation,
        ...allocations.slice(index + 1),
      ])
    },
    [addAllocation, allocations, setAllocations],
  )

  return { allocations, addAllocation, removeAllocation, upsertAllocation }
}
