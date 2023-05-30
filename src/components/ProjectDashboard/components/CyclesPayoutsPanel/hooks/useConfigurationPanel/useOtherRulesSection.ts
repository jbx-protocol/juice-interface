import { t } from '@lingui/macro'
import {
  useProjectContext,
  useProjectMetadata,
} from 'components/ProjectDashboard/hooks'
import { useProjectUpcomingFundingCycle } from 'hooks/v2v3/contractReader/useProjectUpcomingFundingCycle'
import { useMemo } from 'react'
import {
  ConfigurationPanelDatum,
  ConfigurationPanelTableData,
} from '../../components/ConfigurationPanel'
import { flagPairToDatum } from '../../utils/flagPairToDatum'

export const useOtherRulesSection = (
  type: 'current' | 'upcoming',
): ConfigurationPanelTableData => {
  const { projectId } = useProjectMetadata()

  const { fundingCycleMetadata } = useProjectContext()
  const { data: upcomingFundingCycleData } = useProjectUpcomingFundingCycle({
    projectId,
  })
  const [, upcomingFundingCycleMetadata] = upcomingFundingCycleData ?? []

  const paymentsToThisProjectDatum: ConfigurationPanelDatum = useMemo(() => {
    const currentPaymentsToThisProject =
      fundingCycleMetadata?.pausePay !== undefined
        ? !fundingCycleMetadata.pausePay
        : undefined
    const upcomingPaymentsToThisProject =
      upcomingFundingCycleMetadata?.pausePay !== undefined
        ? !upcomingFundingCycleMetadata.pausePay
        : undefined

    return flagPairToDatum(
      t`Payments to this project`,
      type,
      currentPaymentsToThisProject,
      upcomingPaymentsToThisProject,
    )
  }, [
    fundingCycleMetadata?.pausePay,
    type,
    upcomingFundingCycleMetadata?.pausePay,
  ])

  const holdFeesDatum = useMemo(() => {
    const currentHoldFees = fundingCycleMetadata?.holdFees
    const upcomingHoldFees = upcomingFundingCycleMetadata?.holdFees

    return flagPairToDatum(
      t`Hold fees`,
      type,
      currentHoldFees,
      upcomingHoldFees,
    )
  }, [
    fundingCycleMetadata?.holdFees,
    type,
    upcomingFundingCycleMetadata?.holdFees,
  ])

  const setPaymentTerminalsDatum: ConfigurationPanelDatum = useMemo(() => {
    const currentSetPaymentTerminals =
      fundingCycleMetadata?.global.allowSetTerminals
    const upcomingSetPaymentTerminals =
      upcomingFundingCycleMetadata?.global.allowSetTerminals

    return flagPairToDatum(
      t`Set payment terminals`,
      type,
      currentSetPaymentTerminals,
      upcomingSetPaymentTerminals,
    )
  }, [
    fundingCycleMetadata?.global.allowSetTerminals,
    type,
    upcomingFundingCycleMetadata?.global.allowSetTerminals,
  ])

  const setControllerDatum: ConfigurationPanelDatum = useMemo(() => {
    const currentSetController = fundingCycleMetadata?.global.allowSetController
    const upcomingSetController =
      upcomingFundingCycleMetadata?.global.allowSetController

    return flagPairToDatum(
      t`Set controller`,
      type,
      currentSetController,
      upcomingSetController,
    )
  }, [
    fundingCycleMetadata?.global.allowSetController,
    type,
    upcomingFundingCycleMetadata?.global.allowSetController,
  ])

  // Generate the rest of the data, copilot
  // Migrate payment terminal
  // Migrate controller
  const migratePaymentTerminalDatum: ConfigurationPanelDatum = useMemo(() => {
    const currentMigratePaymentTerminal =
      fundingCycleMetadata?.allowTerminalMigration
    const upcomingMigratePaymentTerminal =
      upcomingFundingCycleMetadata?.allowTerminalMigration

    return flagPairToDatum(
      t`Migrate payment terminal`,
      type,
      currentMigratePaymentTerminal,
      upcomingMigratePaymentTerminal,
    )
  }, [
    fundingCycleMetadata?.allowTerminalMigration,
    type,
    upcomingFundingCycleMetadata?.allowTerminalMigration,
  ])

  const migrateControllerDatum: ConfigurationPanelDatum = useMemo(() => {
    const currentMigrateController =
      fundingCycleMetadata?.allowControllerMigration
    const upcomingMigrateController =
      upcomingFundingCycleMetadata?.allowControllerMigration

    return flagPairToDatum(
      t`Migrate controller`,
      type,
      currentMigrateController,
      upcomingMigrateController,
    )
  }, [
    fundingCycleMetadata?.allowControllerMigration,
    type,
    upcomingFundingCycleMetadata?.allowControllerMigration,
  ])

  return useMemo(() => {
    return {
      paymentsToThisProject: paymentsToThisProjectDatum,
      holdFees: holdFeesDatum,
      setPaymentTerminals: setPaymentTerminalsDatum,
      setController: setControllerDatum,
      migratePaymentTerminal: migratePaymentTerminalDatum,
      migrateController: migrateControllerDatum,
    }
  }, [
    holdFeesDatum,
    migrateControllerDatum,
    migratePaymentTerminalDatum,
    paymentsToThisProjectDatum,
    setControllerDatum,
    setPaymentTerminalsDatum,
  ])
}
