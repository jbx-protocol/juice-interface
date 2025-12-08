import { t } from '@lingui/macro'
import { ConfigurationPanelTableData } from 'components/Project/ProjectTabs/CyclesPayoutsTab/ConfigurationPanel'
import { flagPairToDatum } from 'components/Project/ProjectTabs/utils/flagPairToDatum'
import { pairToDatum } from 'components/Project/ProjectTabs/utils/pairToDatum'
import { JBRulesetMetadata } from 'juice-sdk-core'
import { useMemo } from 'react'
import { isZeroAddress } from 'utils/address'
import { etherscanLink } from 'utils/etherscan'

export const useV4V5FormatExtensionSection = (
  rulesetMetadata: JBRulesetMetadata | undefined,
): ConfigurationPanelTableData | null => {
  const contractDatum = useMemo(() => {
    const contract = rulesetMetadata?.dataHook
    const link = contract ? etherscanLink('address', contract) : undefined
    return pairToDatum(t`Contract`, contract, null, link, true)
  }, [rulesetMetadata?.dataHook])

  const useForPaymentsDatum = useMemo(() => {
    const value = rulesetMetadata?.useDataHookForPay
    return flagPairToDatum(t`Use for payments`, value, null)
  }, [rulesetMetadata?.useDataHookForPay])

  const useForRedemptionsDatum = useMemo(() => {
    const value = rulesetMetadata?.useDataHookForCashOut
    return flagPairToDatum(t`Use for redemptions`, value, null)
  }, [rulesetMetadata?.useDataHookForCashOut])

  const formatted = useMemo(() => {
    return {
      contract: contractDatum,
      useForPayments: useForPaymentsDatum,
      useForRedemptions: useForRedemptionsDatum,
    }
  }, [contractDatum, useForPaymentsDatum, useForRedemptionsDatum])

  if (isZeroAddress(rulesetMetadata?.dataHook)) {
    return null
  }

  return formatted
}
