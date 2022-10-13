import { Split } from 'models/splits'
import { AllocationSplit } from '../components/Allocation'

export const splitToAllocation = (split: Split): AllocationSplit => {
  return {
    id: `${split.beneficiary}${split.projectId ? `-${split.projectId}` : ''}`,
    ...split,
  }
}
