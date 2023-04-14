import { AllocationSplit } from 'components/v2v3/shared/Allocation'
import { defaultSplit, Split } from 'models/splits'
import { sanitizeSplit } from 'utils/splits'
import { preciseFormatSplitPercent, splitPercentFrom } from 'utils/v2v3/math'

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
