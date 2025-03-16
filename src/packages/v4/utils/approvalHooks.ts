import { SECONDS_IN_DAY, SEVEN_DAYS_IN_HOURS, THREE_DAYS_IN_SECONDS, THREE_HOURS_IN_SECONDS } from 'constants/numbers'

import { ApprovalHook } from 'models/approvalHooks'
import { isEqualAddress } from 'utils/address'

/**
 * Get all approval hook strategies
 */
export const approvalStrategiesFn = (): ApprovalHook[] => [
  {
    address: '0x05505582a553669f540ba2dd0b55fc75b8176c40',
    name: '7 days',
    description: 'Approval after 7 days',
    durationSeconds: SEVEN_DAYS_IN_HOURS,
  },
  {
    address: '0xd7ce0fe638e02a31fc7c8c231684d85ad9b2ca3d',
    name: '1 day',
    description: 'Approval after 1 day',
    durationSeconds: SECONDS_IN_DAY,
  },
  {
    address: '0xba8a653a5cc985d2f1458e80a9700490c11ab981',
    name: '3 days',
    description: 'Approval after 3 days',
    durationSeconds: THREE_DAYS_IN_SECONDS,
  },
  {
    address: '0xd0adabed7c69758884d2287ddb6fc68bbaf831b1',
    name: '3 hours',
    description: 'Approval after 3 hours',
    durationSeconds: THREE_HOURS_IN_SECONDS,
  },
]

/**
 * Create a custom approval hook strategy
 */
export const createCustomApprovalStrategy = (address: string): ApprovalHook => ({
  address,
  name: 'Custom',
  description: 'Custom approval hook',
  unknown: true,
})

/**
 * Get an approval strategy (1 day, 1 week, etc.) by address
 */
export const getApprovalStrategyByAddress = (address: string): ApprovalHook => {
  const strategy = 
    approvalStrategiesFn().find(s => isEqualAddress(s.address, address)) ?? 
    createCustomApprovalStrategy(address)
  return strategy
}
