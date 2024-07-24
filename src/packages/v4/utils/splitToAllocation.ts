import { JBSplit } from 'juice-sdk-core'

import { AllocationSplit } from '../components/Allocation/Allocation'
import { defaultSplit } from '../models/split'
import { sanitizeSplit } from './v4Splits'

export const splitToAllocation = (split: JBSplit): AllocationSplit => {
  return {
    id: `${split.beneficiary}${
      split.projectId !== undefined && split.projectId !== 0n ? `-${split.projectId}` : ''
    }`,
    ...split,
    percent: split.percent
  }
}

export const allocationToSplit = (allocation: AllocationSplit): JBSplit => {
  const a = {
    ...defaultSplit,
    ...allocation,
    percent: allocation.percent,
  }
  return sanitizeSplit(a)
}
