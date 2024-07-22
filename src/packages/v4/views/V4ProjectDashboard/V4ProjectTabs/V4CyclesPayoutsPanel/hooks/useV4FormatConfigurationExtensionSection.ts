import { t } from '@lingui/macro'
import {
  ConfigurationPanelDatum,
  ConfigurationPanelTableData,
} from 'components/Project/ProjectTabs/CyclesPayoutsTab/ConfigurationPanel'
import { flagPairToDatum } from 'components/Project/ProjectTabs/utils/flagPairToDatum'
import { pairToDatum } from 'components/Project/ProjectTabs/utils/pairToDatum'
import { JBRulesetMetadata } from 'juice-sdk-core'
import { useMemo } from 'react'
import { isZeroAddress } from 'utils/address'
import { etherscanLink } from 'utils/etherscan'

export const useV4FormatConfigurationExtensionSection = ({
  rulesetMetadata,
  upcomingRulesetMetadata,
}: {
  rulesetMetadata: JBRulesetMetadata | null | undefined
  upcomingRulesetMetadata: JBRulesetMetadata | null | undefined
}): ConfigurationPanelTableData | null => {
  const contractDatum: ConfigurationPanelDatum = useMemo(() => {
    const currentContract = rulesetMetadata?.dataHook
    const upcomingContract = upcomingRulesetMetadata?.dataHook

    if (upcomingRulesetMetadata === null) {
      const link = currentContract
        ? etherscanLink('address', currentContract)
        : undefined
      return pairToDatum(t`Contract`, currentContract, null, link, true)
    }

    const link = upcomingContract
      ? etherscanLink('address', upcomingContract)
      : currentContract
      ? etherscanLink('address', currentContract)
      : undefined
    return pairToDatum(
      t`Contract`,
      currentContract,
      upcomingContract,
      link,
      true,
    )
  }, [rulesetMetadata?.dataHook, upcomingRulesetMetadata])

  const useForPaymentsDatum: ConfigurationPanelDatum = useMemo(() => {
    const currentUseForPayments = rulesetMetadata?.useDataHookForPay
    const upcomingUseForPayments =
      upcomingRulesetMetadata?.useDataHookForPay

    if (upcomingRulesetMetadata === null) {
      return flagPairToDatum(t`Use for payments`, currentUseForPayments, null)
    }

    return flagPairToDatum(
      t`Use for payments`,
      currentUseForPayments,
      upcomingUseForPayments,
    )
  }, [rulesetMetadata?.useDataHookForPay, upcomingRulesetMetadata])

  const useForRedemptionsDatum: ConfigurationPanelDatum = useMemo(() => {
    const currentUseForRedemptions =
      rulesetMetadata?.useDataHookForRedeem
    const upcomingUseForRedemptions =
      upcomingRulesetMetadata?.useDataHookForRedeem

    if (upcomingRulesetMetadata === null) {
      return flagPairToDatum(
        t`Use for redemptions`,
        currentUseForRedemptions,
        null,
      )
    }

    return flagPairToDatum(
      t`Use for redemptions`,
      currentUseForRedemptions,
      upcomingUseForRedemptions,
    )
  }, [
    rulesetMetadata?.useDataHookForRedeem,
    upcomingRulesetMetadata,
  ])

  const formatted = useMemo(() => {
    return {
      contract: contractDatum,
      useForPayments: useForPaymentsDatum,
      useForRedemptions: useForRedemptionsDatum,
    }
  }, [contractDatum, useForPaymentsDatum, useForRedemptionsDatum])

  if (
    isZeroAddress(rulesetMetadata?.dataHook) &&
    !upcomingRulesetMetadata
  ) {
    return null
  }

  return formatted
}
