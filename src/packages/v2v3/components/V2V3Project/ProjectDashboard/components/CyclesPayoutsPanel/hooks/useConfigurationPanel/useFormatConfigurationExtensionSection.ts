import { t } from '@lingui/macro'
import {
    ConfigurationPanelDatum,
    ConfigurationPanelTableData,
} from 'components/Project/ProjectTabs/CyclesPayoutsTab/ConfigurationPanel'
import { flagPairToDatum } from 'components/Project/ProjectTabs/utils/flagPairToDatum'
import { pairToDatum } from 'components/Project/ProjectTabs/utils/pairToDatum'
import { V2V3FundingCycleMetadata } from 'packages/v2v3/models/fundingCycle'
import { useMemo } from 'react'
import { isZeroAddress } from 'utils/address'
import { etherscanLink } from 'utils/etherscan'

export const useFormatConfigurationExtensionSection = ({
  fundingCycleMetadata,
  upcomingFundingCycleMetadata,
}: {
  fundingCycleMetadata: V2V3FundingCycleMetadata | undefined
  upcomingFundingCycleMetadata?: V2V3FundingCycleMetadata | null
}): ConfigurationPanelTableData | null => {
  const contractDatum: ConfigurationPanelDatum = useMemo(() => {
    const currentContract = fundingCycleMetadata?.dataSource
    const upcomingContract = upcomingFundingCycleMetadata?.dataSource

    if (upcomingFundingCycleMetadata === null) {
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
  }, [fundingCycleMetadata?.dataSource, upcomingFundingCycleMetadata])

  const useForPaymentsDatum: ConfigurationPanelDatum = useMemo(() => {
    const currentUseForPayments = fundingCycleMetadata?.useDataSourceForPay
    const upcomingUseForPayments =
      upcomingFundingCycleMetadata?.useDataSourceForPay

    if (upcomingFundingCycleMetadata === null) {
      return flagPairToDatum(t`Use for payments`, currentUseForPayments, null)
    }

    return flagPairToDatum(
      t`Use for payments`,
      currentUseForPayments,
      upcomingUseForPayments,
    )
  }, [fundingCycleMetadata?.useDataSourceForPay, upcomingFundingCycleMetadata])

  const useForRedemptionsDatum: ConfigurationPanelDatum = useMemo(() => {
    const currentUseForRedemptions =
      fundingCycleMetadata?.useDataSourceForRedeem
    const upcomingUseForRedemptions =
      upcomingFundingCycleMetadata?.useDataSourceForRedeem

    if (upcomingFundingCycleMetadata === null) {
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
    fundingCycleMetadata?.useDataSourceForRedeem,
    upcomingFundingCycleMetadata,
  ])

  const formatted = useMemo(() => {
    return {
      contract: contractDatum,
      useForPayments: useForPaymentsDatum,
      useForRedemptions: useForRedemptionsDatum,
    }
  }, [contractDatum, useForPaymentsDatum, useForRedemptionsDatum])

  if (
    isZeroAddress(fundingCycleMetadata?.dataSource) &&
    !upcomingFundingCycleMetadata
  ) {
    return null
  }

  return formatted
}
