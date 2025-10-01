import { SECONDS_IN_DAY, SEVEN_DAYS_IN_HOURS, THREE_DAYS_IN_SECONDS } from 'constants/numbers'

import { ApprovalHook } from 'models/approvalHooks'
import { durationBallotStrategyDescription } from 'packages/v2v3/constants/ballotStrategies'
import { isEqualAddress } from 'utils/address'
import { t } from '@lingui/macro'
import { zeroAddress } from 'viem'

// V5 approval hook addresses from https://github.com/Bananapus/nana-core-v5
const V5_APPROVAL_HOOKS = {
  oneDay: '0xcffdd1303f24145bd2c84e7bf15af1eb6ab924d7',
  threeDay: '0x09b23b09af88bb6d7e9c957ff9f861f1c917111b',
  threeHour: '0x4eeb65e13ade86155d169ba1fabd06828171799a',
  sevenDay: '0xdf911b94712cf117fb63b69838b16e1710636031',
}

// V4 approval hook addresses (kept for backward compatibility)
const V4_APPROVAL_HOOKS = {
  oneDay: '0xd7ce0fe638e02a31fc7c8c231684d85ad9b2ca3d',
  threeDay: '0xba8a653a5cc985d2f1458e80a9700490c11ab981',
  sevenDay: '0x05505582a553669f540ba2dd0b55fc75b8176c40',
  // threeHour: '0xd0adabed7c69758884d2287ddb6fc68bbaf831b1', // Not available in v4 UI yet
}

/**
 * Get all approval hook strategies
 * Uses v5 addresses as the default since new projects should use v5
 */
export const getAvailableApprovalStrategies = (): ApprovalHook[] => [
  {
    id: 'sevenDay',
    address: V5_APPROVAL_HOOKS.sevenDay,
    name: t`7-day deadline`,
    description: durationBallotStrategyDescription(7),
    durationSeconds: SEVEN_DAYS_IN_HOURS,
  },
  {
    id: 'oneDay',
    address: V5_APPROVAL_HOOKS.oneDay,
    name: t`1-day deadline`,
    description: durationBallotStrategyDescription(1),
    durationSeconds: SECONDS_IN_DAY,
  },
  {
    id: 'threeDay',
    address: V5_APPROVAL_HOOKS.threeDay,
    name: t`3-day deadline`,
    description: durationBallotStrategyDescription(3),
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
  //   address: V5_APPROVAL_HOOKS.threeHour,
  //   name: '3 hours',
  //   description: 'Approval after 3 hours',
  //   durationSeconds: THREE_HOURS_IN_SECONDS,
  // },
]

/**
 * Get v4 approval hook strategies
 * Used for backward compatibility with existing v4 projects
 */
export const getV4ApprovalStrategies = (): ApprovalHook[] => [
  {
    id: 'sevenDay',
    address: V4_APPROVAL_HOOKS.sevenDay,
    name: t`7-day deadline`,
    description: durationBallotStrategyDescription(7),
    durationSeconds: SEVEN_DAYS_IN_HOURS,
  },
  {
    id: 'oneDay',
    address: V4_APPROVAL_HOOKS.oneDay,
    name: t`1-day deadline`,
    description: durationBallotStrategyDescription(1),
    durationSeconds: SECONDS_IN_DAY,
  },
  {
    id: 'threeDay',
    address: V4_APPROVAL_HOOKS.threeDay,
    name: t`3-day deadline`,
    description: durationBallotStrategyDescription(3),
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
 * Checks both v5 and v4 addresses for backward compatibility
 */
export const getApprovalStrategyByAddress = (address: string): ApprovalHook => {
  // First check v5 strategies
  let strategy = getAvailableApprovalStrategies().find(s => isEqualAddress(s.address, address))

  // If not found, check v4 strategies for backward compatibility
  if (!strategy) {
    strategy = getV4ApprovalStrategies().find(s => isEqualAddress(s.address, address))
  }

  // If still not found, create a custom strategy
  if (!strategy) {
    strategy = createCustomApprovalStrategy(address)
  }

  return strategy
}
