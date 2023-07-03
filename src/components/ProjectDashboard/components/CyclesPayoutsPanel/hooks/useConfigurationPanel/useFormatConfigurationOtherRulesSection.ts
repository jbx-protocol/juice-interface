import { t } from '@lingui/macro'
import { V2V3FundingCycleMetadata } from 'models/v2v3/fundingCycle'
import { useMemo } from 'react'
import {
  ConfigurationPanelDatum,
  ConfigurationPanelTableData,
} from '../../components/ConfigurationPanel'
import { flagPairToDatum } from '../../utils/flagPairToDatum'

export const useFormatConfigurationOtherRulesSection = ({
  fundingCycleMetadata,
  upcomingFundingCycleMetadata,
}: {
  fundingCycleMetadata: V2V3FundingCycleMetadata | undefined
  upcomingFundingCycleMetadata?: V2V3FundingCycleMetadata | null
}): ConfigurationPanelTableData => {
  const paymentsToThisProjectDatum: ConfigurationPanelDatum = useMemo(() => {
    const currentPaymentsToThisProject =
      fundingCycleMetadata?.pausePay !== undefined
        ? !fundingCycleMetadata.pausePay
        : undefined

    if (upcomingFundingCycleMetadata === null) {
      return flagPairToDatum(
        t`Payments to this project`,
        currentPaymentsToThisProject,
        null,
      )
    }

    const upcomingPaymentsToThisProject =
      upcomingFundingCycleMetadata?.pausePay !== undefined
        ? !upcomingFundingCycleMetadata.pausePay
        : undefined

    return flagPairToDatum(
      t`Payments to this project`,
      currentPaymentsToThisProject,
      upcomingPaymentsToThisProject,
    )
  }, [fundingCycleMetadata?.pausePay, upcomingFundingCycleMetadata])

  const holdFeesDatum = useMemo(() => {
    const currentHoldFees = fundingCycleMetadata?.holdFees
    if (upcomingFundingCycleMetadata === null) {
      return flagPairToDatum(t`Hold fees`, currentHoldFees, null)
    }
    const upcomingHoldFees = upcomingFundingCycleMetadata?.holdFees

    return flagPairToDatum(t`Hold fees`, currentHoldFees, upcomingHoldFees)
  }, [fundingCycleMetadata?.holdFees, upcomingFundingCycleMetadata])

  const setPaymentTerminalsDatum: ConfigurationPanelDatum = useMemo(() => {
    const currentSetPaymentTerminals =
      fundingCycleMetadata?.global.allowSetTerminals
    if (upcomingFundingCycleMetadata === null) {
      return flagPairToDatum(
        t`Set payment terminals`,
        currentSetPaymentTerminals,
        null,
      )
    }
    const upcomingSetPaymentTerminals =
      upcomingFundingCycleMetadata?.global.allowSetTerminals

    return flagPairToDatum(
      t`Set payment terminals`,
      currentSetPaymentTerminals,
      upcomingSetPaymentTerminals,
    )
  }, [
    fundingCycleMetadata?.global.allowSetTerminals,
    upcomingFundingCycleMetadata,
  ])

  const setControllerDatum: ConfigurationPanelDatum = useMemo(() => {
    const currentSetController = fundingCycleMetadata?.global.allowSetController
    if (upcomingFundingCycleMetadata === null) {
      return flagPairToDatum(t`Set controller`, currentSetController, null)
    }
    const upcomingSetController =
      upcomingFundingCycleMetadata?.global.allowSetController

    return flagPairToDatum(
      t`Set controller`,
      currentSetController,
      upcomingSetController,
    )
  }, [
    fundingCycleMetadata?.global.allowSetController,
    upcomingFundingCycleMetadata,
  ])

  // Generate the rest of the data, copilot
  // Migrate payment terminal
  // Migrate controller
  const migratePaymentTerminalDatum: ConfigurationPanelDatum = useMemo(() => {
    const currentMigratePaymentTerminal =
      fundingCycleMetadata?.allowTerminalMigration
    if (upcomingFundingCycleMetadata === null) {
      return flagPairToDatum(
        t`Migrate payment terminal`,
        currentMigratePaymentTerminal,
        null,
      )
    }
    const upcomingMigratePaymentTerminal =
      upcomingFundingCycleMetadata?.allowTerminalMigration

    return flagPairToDatum(
      t`Migrate payment terminal`,
      currentMigratePaymentTerminal,
      upcomingMigratePaymentTerminal,
    )
  }, [
    fundingCycleMetadata?.allowTerminalMigration,
    upcomingFundingCycleMetadata,
  ])

  const migrateControllerDatum: ConfigurationPanelDatum = useMemo(() => {
    const currentMigrateController =
      fundingCycleMetadata?.allowControllerMigration
    if (upcomingFundingCycleMetadata === null) {
      return flagPairToDatum(
        t`Migrate controller`,
        currentMigrateController,
        null,
      )
    }
    const upcomingMigrateController =
      upcomingFundingCycleMetadata?.allowControllerMigration

    return flagPairToDatum(
      t`Migrate controller`,
      currentMigrateController,
      upcomingMigrateController,
    )
  }, [
    fundingCycleMetadata?.allowControllerMigration,
    upcomingFundingCycleMetadata,
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
