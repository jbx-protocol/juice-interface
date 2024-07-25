import { JBSplit, SplitPortion } from 'juice-sdk-core'

import { zeroAddress } from 'viem'
import { AllocationSplit } from '../components/Allocation/Allocation'
import { sanitizeSplit } from './v4Splits'

const defaultSplit: JBSplit = {
  beneficiary: zeroAddress,
  percent: new SplitPortion(0),
  preferAddToBalance: false,
  lockedUntil: 0,
  projectId: 0n,
  hook: zeroAddress,
}

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
