import { t } from '@lingui/macro'
import { ConfigurationPanelTableData } from 'components/Project/ProjectTabs/CyclesPayoutsTab/ConfigurationPanel'
import { flagPairToDatum } from 'components/Project/ProjectTabs/utils/flagPairToDatum'
import { JBRulesetMetadata } from 'juice-sdk-core'
import { useMemo } from 'react'

export const useV4V5FormatOtherRulesSection = (
  rulesetMetadata: JBRulesetMetadata | undefined,
): ConfigurationPanelTableData => {
  const paymentsToThisProjectDatum = useMemo(() => {
    const value =
      rulesetMetadata?.pausePay !== undefined
        ? !rulesetMetadata.pausePay
        : undefined
    return flagPairToDatum(t`Payments to this project`, value, null)
  }, [rulesetMetadata?.pausePay])

  const holdFeesDatum = useMemo(() => {
    const value = rulesetMetadata?.holdFees
    return flagPairToDatum(t`Hold fees`, value, null)
  }, [rulesetMetadata?.holdFees])

  const setPaymentTerminalsDatum = useMemo(() => {
    const value = rulesetMetadata?.allowSetTerminals
    return flagPairToDatum(t`Set payment terminals`, value, null)
  }, [rulesetMetadata?.allowSetTerminals])

  const setControllerDatum = useMemo(() => {
    const value = rulesetMetadata?.allowSetController
    return flagPairToDatum(t`Set controller`, value, null)
  }, [rulesetMetadata?.allowSetController])

  const migratePaymentTerminalDatum = useMemo(() => {
    const value = rulesetMetadata?.allowTerminalMigration
    return flagPairToDatum(t`Migrate payment terminal`, value, null)
  }, [rulesetMetadata?.allowTerminalMigration])

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
