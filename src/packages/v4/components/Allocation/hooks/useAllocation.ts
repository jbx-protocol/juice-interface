import { useArray } from 'hooks/useArray'
import { FormItemInput } from 'models/formItemInput'
import { AllocationSplit } from '../Allocation'

export const useAllocation = ({
  value,
  onChange,
}: FormItemInput<AllocationSplit[]>) => {
  const {
    values: allocations,
    add: addAllocation,
    remove: removeAllocation,
    upsert: upsertAllocation,
    set: setAllocations,
  } = useArray([value, onChange])

  return {
    allocations,
    addAllocation,
    removeAllocation,
    upsertAllocation,
    setAllocations,
  }
}
