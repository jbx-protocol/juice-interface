import { t } from '@lingui/macro'
import {
  ConfigurationPanelDatum,
  ConfigurationPanelTableData,
} from 'components/Project/ProjectTabs/CyclesPayoutsTab/ConfigurationPanel'
import { flagPairToDatum } from 'components/Project/ProjectTabs/utils/flagPairToDatum'
import { pairToDatum } from 'components/Project/ProjectTabs/utils/pairToDatum'
import { JBRulesetData, JBRulesetMetadata } from 'juice-sdk-core'
import { useMemo } from 'react'
import { formattedNum } from 'utils/format/formatNumber'
import { tokenSymbolText } from 'utils/tokenSymbolText'

export const useV4FormatConfigurationTokenSection = ({
  ruleset,
  rulesetMetadata,
  tokenSymbol: tokenSymbolRaw,
  upcomingRuleset,
  upcomingRulesetLoading,
  upcomingRulesetMetadata,
}: {
  ruleset: JBRulesetData | undefined | null
  rulesetMetadata: JBRulesetMetadata | undefined | null
  tokenSymbol: string | undefined
  upcomingRuleset: JBRulesetData | undefined | null
  upcomingRulesetLoading: boolean
  upcomingRulesetMetadata?: JBRulesetMetadata | undefined | null
}): ConfigurationPanelTableData => {
  const tokenSymbol = tokenSymbolText({
    tokenSymbol: tokenSymbolRaw,
    capitalize: false,
    plural: true,
  })

  const decayPercentFloat = ruleset?.decayPercent.toFloat()
  const currentTotalIssuanceRate = ruleset?.weight.toFloat()
  const currentTotalIssuanceRateFormatted = formattedNum(currentTotalIssuanceRate)

  const queuedTotalIssuanceRate = upcomingRuleset
    ? upcomingRuleset?.weight.toFloat()
    : typeof currentTotalIssuanceRate !== 'undefined' &&
      typeof decayPercentFloat !== 'undefined'
    ? currentTotalIssuanceRate - currentTotalIssuanceRate * decayPercentFloat
    : undefined
  const queuedTotalIssuanceRateFormatted = formattedNum(queuedTotalIssuanceRate)

  const totalIssuanceRateDatum: ConfigurationPanelDatum = useMemo(() => {
    const current = currentTotalIssuanceRateFormatted !== undefined
      ? `${currentTotalIssuanceRateFormatted} ${tokenSymbol}/ETH`
      : undefined

    if (upcomingRuleset === null || upcomingRulesetLoading) {
      return pairToDatum(t`Total issuance rate`, current, null)
    }

    const queued = queuedTotalIssuanceRate !== undefined
      ? `${queuedTotalIssuanceRateFormatted} ${tokenSymbol}/ETH`
      : undefined

    return pairToDatum(t`Total issuance rate`, current, queued)
  }, [
    upcomingRuleset,
    tokenSymbol,
    queuedTotalIssuanceRate,
    upcomingRulesetLoading,
    currentTotalIssuanceRateFormatted,
    queuedTotalIssuanceRateFormatted
  ])

  const reservedPercentFloat = rulesetMetadata?.reservedPercent.toFloat()
  const queuedReservedPercentFloat =
    upcomingRulesetMetadata?.reservedPercent.toFloat()

  const payerIssuanceRateDatum: ConfigurationPanelDatum = useMemo(() => {
    const currentPayerIssuanceRate =
      typeof currentTotalIssuanceRate !== 'undefined' &&
      typeof reservedPercentFloat !== 'undefined'
        ? currentTotalIssuanceRate -
          currentTotalIssuanceRate * reservedPercentFloat
        : undefined
    const currentPayerIssuanceRateFormatted = formattedNum(currentPayerIssuanceRate)

    const current = currentPayerIssuanceRate !== undefined
      ? `${currentPayerIssuanceRateFormatted} ${tokenSymbol}/ETH`
      : undefined

    if (
      upcomingRuleset === null ||
      upcomingRulesetMetadata === null ||
      upcomingRulesetLoading
    ) {
      return pairToDatum(t`Payer issuance rate`, current, null)
    }

    const _reservedPercent = queuedReservedPercentFloat ?? reservedPercentFloat
    const queuedPayerIssuanceRate =
      queuedTotalIssuanceRate && _reservedPercent !== undefined
        ? queuedTotalIssuanceRate - queuedTotalIssuanceRate * _reservedPercent
        : undefined
    const queuedPayerIssuanceRateFormatted = formattedNum(queuedPayerIssuanceRate)
    const queued = queuedPayerIssuanceRate !== undefined
      ? `${queuedPayerIssuanceRateFormatted} ${tokenSymbol}/ETH`
      : undefined

    return pairToDatum(t`Payer issuance rate`, current, queued)
  }, [
    tokenSymbol,
    upcomingRuleset,
    queuedReservedPercentFloat,
    upcomingRulesetMetadata,
    currentTotalIssuanceRate,
    queuedTotalIssuanceRate,
    reservedPercentFloat,
    upcomingRulesetLoading,
  ])

  const reservedPercentDatum: ConfigurationPanelDatum = useMemo(() => {
    const current = rulesetMetadata?.reservedPercent
      ? `${rulesetMetadata.reservedPercent.formatPercentage()}%`
      : undefined
    if (upcomingRulesetMetadata === null || upcomingRulesetLoading) {
      return pairToDatum(t`Reserved rate`, current, null)
    }

    const queued = upcomingRulesetMetadata?.reservedPercent
      ? `${upcomingRulesetMetadata.reservedPercent.formatPercentage()}%`
      : rulesetMetadata?.reservedPercent
      ? `${rulesetMetadata.reservedPercent.formatPercentage()}%`
      : undefined
    return pairToDatum(t`Reserved rate`, current, queued)
  }, [upcomingRulesetMetadata, rulesetMetadata, upcomingRulesetLoading])

  const decayPercentDatum: ConfigurationPanelDatum = useMemo(() => {
    const current = ruleset
      ? `${ruleset.decayPercent.formatPercentage()}%`
      : undefined

    if (upcomingRuleset === null || upcomingRulesetLoading) {
      return pairToDatum(t`Decay rate`, current, null)
    }
    const queued = upcomingRuleset
      ? `${upcomingRuleset.decayPercent.formatPercentage()}%`
      : ruleset
      ? `${ruleset.decayPercent.formatPercentage()}%`
      : undefined

    return pairToDatum(t`Decay rate`, current, queued)
  }, [ruleset, upcomingRuleset, upcomingRulesetLoading])

  const redemptionRateDatum: ConfigurationPanelDatum = useMemo(() => {
    const currentRedemptionRate =
      rulesetMetadata?.redemptionRate.formatPercentage()

    const current = currentRedemptionRate
      ? `${currentRedemptionRate}%`
      : undefined

    if (upcomingRulesetMetadata === null || upcomingRulesetLoading) {
      return pairToDatum(t`Redemption rate`, current, null)
    }

    const queued = upcomingRulesetMetadata
      ? `${upcomingRulesetMetadata?.redemptionRate.formatPercentage()}%`
      : rulesetMetadata
      ? `${rulesetMetadata.redemptionRate.formatPercentage()}%`
      : undefined
    return pairToDatum(t`Redemption rate`, current, queued)
  }, [upcomingRulesetMetadata, rulesetMetadata, upcomingRulesetLoading])

  const ownerTokenMintingDatum: ConfigurationPanelDatum = useMemo(() => {
    const currentOwnerTokenMinting =
      rulesetMetadata?.allowOwnerMinting !== undefined
        ? rulesetMetadata?.allowOwnerMinting
        : undefined
    if (upcomingRulesetMetadata === null || upcomingRulesetLoading) {
      return flagPairToDatum(
        t`Owner token minting`,
        currentOwnerTokenMinting,
        null,
      )
    }

    const queuedOwnerTokenMinting =
      upcomingRulesetMetadata?.allowOwnerMinting !== undefined
        ? upcomingRulesetMetadata?.allowOwnerMinting
        : rulesetMetadata?.allowOwnerMinting !== undefined
        ? rulesetMetadata.allowOwnerMinting
        : undefined

    return flagPairToDatum(
      t`Owner token minting`,
      currentOwnerTokenMinting,
      queuedOwnerTokenMinting,
    )
  }, [
    rulesetMetadata?.allowOwnerMinting,
    upcomingRulesetMetadata,
    upcomingRulesetLoading,
  ])

  const tokenTransfersDatum: ConfigurationPanelDatum = useMemo(() => {
    const currentTokenTransfersDatum =
      rulesetMetadata?.pauseCreditTransfers !== undefined
        ? !rulesetMetadata?.pauseCreditTransfers
        : undefined
    if (upcomingRulesetMetadata === null || upcomingRulesetLoading) {
      return flagPairToDatum(
        t`Token transfers`,
        !!currentTokenTransfersDatum,
        null,
      )
    }
    const queuedTokenTransfersDatum =
      upcomingRulesetMetadata?.pauseCreditTransfers !== undefined
        ? !upcomingRulesetMetadata?.pauseCreditTransfers
        : rulesetMetadata?.pauseCreditTransfers !== undefined
        ? !rulesetMetadata.pauseCreditTransfers
        : null

    return flagPairToDatum(
      t`Token transfers`,
      currentTokenTransfersDatum,
      queuedTokenTransfersDatum,
    )
  }, [
    rulesetMetadata?.pauseCreditTransfers,
    upcomingRulesetMetadata,
    upcomingRulesetLoading,
  ])

  return useMemo(() => {
    return {
      totalIssuanceRate: totalIssuanceRateDatum,
      payerIssuanceRate: payerIssuanceRateDatum,
      reservedPercent: reservedPercentDatum,
      decayPercentDatum: decayPercentDatum,
      redemptionRate: redemptionRateDatum,
      ownerTokenMintingRate: ownerTokenMintingDatum,
      tokenTransfers: tokenTransfersDatum,
    }
  }, [
    decayPercentDatum,
    totalIssuanceRateDatum,
    ownerTokenMintingDatum,
    payerIssuanceRateDatum,
    redemptionRateDatum,
    reservedPercentDatum,
    tokenTransfersDatum,
  ])
}
