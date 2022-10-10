import { useArray } from 'hooks/Array'
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
  } = useArray([value, onChange])

  return { allocations, addAllocation, removeAllocation, upsertAllocation }
}
