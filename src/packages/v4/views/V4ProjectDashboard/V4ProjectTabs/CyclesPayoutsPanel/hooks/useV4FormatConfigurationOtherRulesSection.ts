import { t } from '@lingui/macro'
import {
  ConfigurationPanelDatum,
  ConfigurationPanelTableData,
} from 'components/Project/ProjectTabs/CyclesPayoutsTab/ConfigurationPanel'
import { flagPairToDatum } from 'components/Project/ProjectTabs/utils/flagPairToDatum'
import { JBRulesetMetadata } from 'juice-sdk-core'
import { useMemo } from 'react'

export const useV4FormatConfigurationOtherRulesSection = ({
  rulesetMetadata,
  upcomingRulesetMetadata,
}: {
  rulesetMetadata: JBRulesetMetadata | undefined | null
  upcomingRulesetMetadata: JBRulesetMetadata | undefined | null
}): ConfigurationPanelTableData => {
  const paymentsToThisProjectDatum: ConfigurationPanelDatum = useMemo(() => {
    const currentPaymentsToThisProject =
      rulesetMetadata?.pausePay !== undefined
        ? !rulesetMetadata.pausePay
        : undefined

    if (upcomingRulesetMetadata === null) {
      return flagPairToDatum(
        t`Payments to this project`,
        currentPaymentsToThisProject,
        null,
      )
    }

    const upcomingPaymentsToThisProject =
      upcomingRulesetMetadata?.pausePay !== undefined
        ? !upcomingRulesetMetadata.pausePay
        : undefined

    return flagPairToDatum(
      t`Payments to this project`,
      currentPaymentsToThisProject,
      upcomingPaymentsToThisProject,
    )
  }, [rulesetMetadata?.pausePay, upcomingRulesetMetadata])

  const holdFeesDatum = useMemo(() => {
    const currentHoldFees = rulesetMetadata?.holdFees
    if (upcomingRulesetMetadata === null) {
      return flagPairToDatum(t`Hold fees`, currentHoldFees, null)
    }
    const upcomingHoldFees = upcomingRulesetMetadata?.holdFees

    return flagPairToDatum(t`Hold fees`, currentHoldFees, upcomingHoldFees)
  }, [rulesetMetadata?.holdFees, upcomingRulesetMetadata])

  const setPaymentTerminalsDatum: ConfigurationPanelDatum = useMemo(() => {
    const currentSetPaymentTerminals =
      rulesetMetadata?.allowSetTerminals
    if (upcomingRulesetMetadata === null) {
      return flagPairToDatum(
        t`Set payment terminals`,
        currentSetPaymentTerminals,
        null,
      )
    }
    const upcomingSetPaymentTerminals =
      upcomingRulesetMetadata?.allowSetTerminals

    return flagPairToDatum(
      t`Set payment terminals`,
      currentSetPaymentTerminals,
      upcomingSetPaymentTerminals,
    )
  }, [
    rulesetMetadata?.allowSetTerminals,
    upcomingRulesetMetadata,
  ])

  const setControllerDatum: ConfigurationPanelDatum = useMemo(() => {
    const currentSetController = rulesetMetadata?.allowSetController
    if (upcomingRulesetMetadata === null) {
      return flagPairToDatum(t`Set controller`, currentSetController, null)
    }
    const upcomingSetController =
      upcomingRulesetMetadata?.allowSetController

    return flagPairToDatum(
      t`Set controller`,
      currentSetController,
      upcomingSetController,
    )
  }, [
    rulesetMetadata?.allowSetController,
    upcomingRulesetMetadata,
  ])

  // Generate the rest of the data, copilot
  // Migrate payment terminal
  // Migrate controller
  const migratePaymentTerminalDatum: ConfigurationPanelDatum = useMemo(() => {
    const currentMigratePaymentTerminal =
      rulesetMetadata?.allowTerminalMigration
    if (upcomingRulesetMetadata === null) {
      return flagPairToDatum(
        t`Migrate payment terminal`,
        currentMigratePaymentTerminal,
        null,
      )
    }
    const upcomingMigratePaymentTerminal =
      upcomingRulesetMetadata?.allowTerminalMigration

    return flagPairToDatum(
      t`Migrate payment terminal`,
      currentMigratePaymentTerminal,
      upcomingMigratePaymentTerminal,
    )
  }, [
    rulesetMetadata?.allowTerminalMigration,
    upcomingRulesetMetadata,
  ])

  return useMemo(() => {
    return {
      paymentsToThisProject: paymentsToThisProjectDatum,
      holdFees: holdFeesDatum,
      setPaymentTerminals: setPaymentTerminalsDatum,
      setController: setControllerDatum,
      migratePaymentTerminal: migratePaymentTerminalDatum,
    }
  }, [
    holdFeesDatum,
    migratePaymentTerminalDatum,
    paymentsToThisProjectDatum,
    setControllerDatum,
    setPaymentTerminalsDatum,
  ])
}
