import {
  formatAllowed,
  formatBoolean,
  formatPaused,
} from 'utils/format/formatBoolean'

import { getAvailableApprovalStrategies } from 'packages/v4/utils/approvalHooks'
import { useMemo } from 'react'
import { useAppSelector } from 'redux/hooks/useAppSelector'

export const useRulesReview = () => {
  const availableBallotStrategies = getAvailableApprovalStrategies()
  const {
    fundingCycleData: { ballot: customAddress },
    reconfigurationRuleSelection,
    fundingCycleMetadata,
    projectMetadata,
  } = useAppSelector(state => state.creatingV2Project)

  const pausePayments = useMemo(() => {
    return formatPaused(fundingCycleMetadata.pausePay)
  }, [fundingCycleMetadata.pausePay])

  const terminalConfiguration = useMemo(() => {
    return formatAllowed(fundingCycleMetadata.global.allowSetTerminals)
  }, [fundingCycleMetadata.global.allowSetTerminals])

  const controllerConfiguration = useMemo(() => {
    return formatAllowed(fundingCycleMetadata.global.allowSetController)
  }, [fundingCycleMetadata.global.allowSetController])

  const terminalMigration = useMemo(() => {
    return formatAllowed(fundingCycleMetadata.allowTerminalMigration)
  }, [fundingCycleMetadata.allowTerminalMigration])

  const controllerMigration = useMemo(() => {
    return formatAllowed(fundingCycleMetadata.allowControllerMigration)
  }, [fundingCycleMetadata.allowControllerMigration])

  const strategy = useMemo(() => {
    return availableBallotStrategies.find(
      strategy => strategy.id === reconfigurationRuleSelection,
    )?.name
  }, [availableBallotStrategies, reconfigurationRuleSelection])

  const holdFees = useMemo(() => {
    return formatBoolean(fundingCycleMetadata.holdFees)
  }, [fundingCycleMetadata.holdFees])
  const ofac = useMemo(() => {
    return formatBoolean(projectMetadata.projectRequiredOFACCheck)
  }, [projectMetadata.projectRequiredOFACCheck])

  return {
    customAddress,
    pausePayments,
    terminalConfiguration,
    controllerConfiguration,
    terminalMigration,
    controllerMigration,
    strategy,
    holdFees,
    ofac,
  }
}
