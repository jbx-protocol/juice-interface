import { defaultSplit, Split } from 'models/splits'
import { AllocationSplit } from 'packages/v2v3/components/shared/Allocation/Allocation'
import {
  preciseFormatSplitPercent,
  splitPercentFrom,
} from 'packages/v2v3/utils/math'
import { sanitizeSplit } from 'packages/v2v3/utils/v2v3Splits'

export const splitToAllocation = (split: Split): AllocationSplit => {
  return {
    id: `${split.beneficiary}${
      split.projectId !== '0x00' ? `-${split.projectId}` : ''
    }`,
    ...split,
    percent: preciseFormatSplitPercent(split.percent),
  }
}

export const allocationToSplit = (allocation: AllocationSplit): Split => {
  const a = {
    ...defaultSplit,
    ...allocation,
    percent: splitPercentFrom(allocation.percent).toNumber(),
  }
  return sanitizeSplit(a)
}
