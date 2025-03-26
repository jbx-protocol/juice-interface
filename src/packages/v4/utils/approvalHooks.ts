import { SECONDS_IN_DAY, SEVEN_DAYS_IN_HOURS, THREE_DAYS_IN_SECONDS } from 'constants/numbers'

import { t } from '@lingui/macro'
import { ApprovalHook } from 'models/approvalHooks'
import { isEqualAddress } from 'utils/address'
import { zeroAddress } from 'viem'

/**
 * Get all approval hook strategies
 */
export const getAvailableApprovalStrategies = (): ApprovalHook[] => [
  {
    id: 'sevenDay',
    address: '0x05505582a553669f540ba2dd0b55fc75b8176c40',
    name: t`7-day deadline`,
    description: 'Approval after 7 days',
    durationSeconds: SEVEN_DAYS_IN_HOURS,
  },
  {
    id: 'oneDay',
    address: '0xd7ce0fe638e02a31fc7c8c231684d85ad9b2ca3d',
    name: t`1-day deadline`,
    description: 'Approval after 1 day',
    durationSeconds: SECONDS_IN_DAY,
  },
  {
    id: 'threeDay',
    address: '0xba8a653a5cc985d2f1458e80a9700490c11ab981',
    name: t`3-day deadline`,
    description: 'Approval after 3 days',
    durationSeconds: THREE_DAYS_IN_SECONDS,
    isDefault: true
  },
  {
    id: 'none',
    address: zeroAddress,
    name: t`No deadline`,
    description: t`Edits to upcoming cycles will take effect when the current cycle ends. A project with no deadline is vulnerable to last-second edits by its owner.`,
    durationSeconds: 0,
  }

  // TODO: ApprovalHookId is still getting mixed with v2v3 stuff in ProjectState so can't use
  // 3hrs until that's fixed
  
  // {
  //   id: 'threeHour',
  //   address: '0xd0adabed7c69758884d2287ddb6fc68bbaf831b1',
  //   name: '3 hours',
  //   description: 'Approval after 3 hours',
  //   durationSeconds: THREE_HOURS_IN_SECONDS,
  // },
]

/**
 * Create a custom approval hook strategy
 */
export const createCustomApprovalStrategy = (address: string): ApprovalHook => ({
  address,
  id: 'custom',
  name: 'Custom',
  description: 'Custom approval hook',
  unknown: true,
})

/**
 * Get an approval strategy (1 day, 1 week, etc.) by address
 */
export const getApprovalStrategyByAddress = (address: string): ApprovalHook => {
  const strategy = 
    getAvailableApprovalStrategies().find(s => isEqualAddress(s.address, address)) ?? 
    createCustomApprovalStrategy(address)
  return strategy
}
