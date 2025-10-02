import {
  SECONDS_IN_DAY,
  SEVEN_DAYS_IN_HOURS,
  THREE_DAYS_IN_SECONDS,
} from 'constants/numbers'

import { t } from '@lingui/macro'
import { JBChainId, jbContractAddress, JBCoreContracts } from 'juice-sdk-core'
import { ApprovalHook } from 'models/approvalHooks'
import { durationBallotStrategyDescription } from 'packages/v2v3/constants/ballotStrategies'
import { isEqualAddress } from 'utils/address'
import { zeroAddress } from 'viem'

/**
 * Get the default chainId for the Create flow based on environment
 * Sepolia (11155111) for testnet, Mainnet (1) for production
 */
export const getDefaultCreateFlowChainId = (): JBChainId => {
  return process.env.NEXT_PUBLIC_TESTNET === 'true' ? 11155111 : 1
}

/**
 * Get approval hook addresses for a specific version and chain from the SDK
 *
 * IMPORTANT: Always pass chainId to query dynamically from the SDK.
 * This ensures we get the correct addresses per chain and is future-proof
 * against potential SDK changes where addresses might differ per chain.
 */
const getApprovalHookAddresses = (version: 4 | 5, chainId: JBChainId) => {
  const chainIdKey = String(
    chainId,
  ) as keyof (typeof jbContractAddress)['4'][JBCoreContracts.JBDeadline1Day]

  return {
    oneDay:
      jbContractAddress[String(version) as '4' | '5'][
        JBCoreContracts.JBDeadline1Day
      ][chainIdKey],
    threeDay:
      jbContractAddress[String(version) as '4' | '5'][
        JBCoreContracts.JBDeadline3Days
      ][chainIdKey],
    sevenDay:
      jbContractAddress[String(version) as '4' | '5'][
        JBCoreContracts.JBDeadline7Days
      ][chainIdKey],
    threeHour:
      version === 5
        ? jbContractAddress['5'][JBCoreContracts.JBDeadline3Hours][chainIdKey]
        : undefined,
  }
}

/**
 * Get all approval hook strategies for a specific version and chain
 *
 * Usage:
 * - For editing existing projects: Pass project's version and chainId
 * - For creating new projects (v5 only): chainId defaults to environment-based default if not provided
 *
 * @param version - 4 or 5
 * @param chainId - Optional chainId. If not provided, defaults to environment-based chainId for Create flow
 */
export const getAvailableApprovalStrategies = (
  version: 4 | 5,
  chainId?: JBChainId,
): ApprovalHook[] => {
  const resolvedChainId = chainId ?? getDefaultCreateFlowChainId()
  const hooks = getApprovalHookAddresses(version, resolvedChainId)

  return [
    {
      id: 'sevenDay',
      address: hooks.sevenDay,
      name: t`7-day deadline`,
      description: durationBallotStrategyDescription(7),
      durationSeconds: SEVEN_DAYS_IN_HOURS,
    },
    {
      id: 'oneDay',
      address: hooks.oneDay,
      name: t`1-day deadline`,
      description: durationBallotStrategyDescription(1),
      durationSeconds: SECONDS_IN_DAY,
    },
    {
      id: 'threeDay',
      address: hooks.threeDay,
      name: t`3-day deadline`,
      description: durationBallotStrategyDescription(3),
      durationSeconds: THREE_DAYS_IN_SECONDS,
      isDefault: true,
    },
    {
      id: 'none',
      address: zeroAddress,
      name: t`No deadline`,
      description: t`Edits to upcoming cycles will take effect when the current cycle ends. A project with no deadline is vulnerable to last-second edits by its owner.`,
      durationSeconds: 0,
    },

    // TODO: ApprovalHookId is still getting mixed with v2v3 stuff in ProjectState so can't use
    // 3hrs until that's fixed

    // {
    //   id: 'threeHour',
    //   address: hooks.threeHour,
    //   name: '3 hours',
    //   description: 'Approval after 3 hours',
    //   durationSeconds: THREE_HOURS_IN_SECONDS,
    // },
  ]
}

/**
 * Get v4 approval hook strategies (deprecated - use getAvailableApprovalStrategies with version param)
 * @deprecated Use getAvailableApprovalStrategies(4, chainId) instead
 */
export const getV4ApprovalStrategies = (chainId: JBChainId): ApprovalHook[] =>
  getAvailableApprovalStrategies(4, chainId)

/**
 * Create a custom approval hook strategy
 */
export const createCustomApprovalStrategy = (
  address: string,
): ApprovalHook => ({
  address,
  id: 'custom',
  name: 'Custom',
  description: 'Custom approval hook',
  unknown: true,
})

/**
 * Get an approval strategy (1 day, 1 week, etc.) by address
 * Checks both v5 and v4 addresses for backward compatibility
 *
 * @param address - The approval hook address
 * @param version - 4 or 5
 * @param chainId - Optional chainId. If not provided, defaults to environment-based chainId for Create flow
 */
export const getApprovalStrategyByAddress = (
  address: string,
  version: 4 | 5,
  chainId?: JBChainId,
): ApprovalHook => {
  const resolvedChainId = chainId ?? getDefaultCreateFlowChainId()

  // Check the specified version first
  let strategy = getAvailableApprovalStrategies(version, resolvedChainId).find(
    s => isEqualAddress(s.address, address),
  )

  if (strategy) return strategy

  // Check both v5 and v4 strategies for backward compatibility
  strategy = getAvailableApprovalStrategies(5, resolvedChainId).find(s =>
    isEqualAddress(s.address, address),
  )

  if (!strategy) {
    strategy = getAvailableApprovalStrategies(4, resolvedChainId).find(s =>
      isEqualAddress(s.address, address),
    )
  }

  // If still not found, create a custom strategy
  if (!strategy) {
    strategy = createCustomApprovalStrategy(address)
  }

  return strategy
}
