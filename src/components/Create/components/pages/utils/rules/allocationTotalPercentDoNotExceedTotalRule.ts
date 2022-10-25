import { RuleObject } from 'antd/lib/form'
import { AllocationSplit } from 'components/Create/components/Allocation'

export const allocationTotalPercentDoNotExceedTotalRule = () => ({
  validator: (rule: RuleObject, value: unknown) => {
    if (value === undefined || value === null) return Promise.resolve()
    if (typeof value !== 'object')
      return Promise.reject('Invalid type - contact Juicebox Support')
    const total = (value as AllocationSplit[]).reduce(
      (acc: number, { percent }) => acc + percent,
      0,
    )
    if (total > 100) {
      return Promise.reject('Total percent cannot exceed 100')
    }
    return Promise.resolve()
  },
})
