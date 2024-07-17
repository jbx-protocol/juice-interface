import { t } from '@lingui/macro'
import {
  ConfigurationPanelDatum,
  ConfigurationPanelTableData,
} from 'components/Project/ProjectTabs/CyclesPayoutsTab/ConfigurationPanel'
import { flagPairToDatum } from 'components/Project/ProjectTabs/utils/flagPairToDatum'
import { pairToDatum } from 'components/Project/ProjectTabs/utils/pairToDatum'
import { JBRulesetMetadata } from 'juice-sdk-core'

import { Ruleset } from 'packages/v4/models/ruleset'
import { useMemo } from 'react'
import { tokenSymbolText } from 'utils/tokenSymbolText'

export const useV4FormatConfigurationTokenSection = ({
  ruleset,
  rulesetMetadata,
  tokenSymbol: tokenSymbolRaw,
  upcomingRuleset,
  upcomingRulesetLoading,
  upcomingRulesetMetadata,
}: {
  ruleset: Ruleset | undefined | null
  rulesetMetadata: JBRulesetMetadata | undefined | null
  tokenSymbol: string | undefined
  upcomingRuleset: Ruleset | undefined | null
  upcomingRulesetLoading: boolean
  upcomingRulesetMetadata?: JBRulesetMetadata | undefined | null
}): ConfigurationPanelTableData => {
  const tokenSymbol = useMemo(
    () =>
      tokenSymbolText({
        tokenSymbol: tokenSymbolRaw,
        capitalize: false,
        plural: true,
      }),
    [tokenSymbolRaw],
  )
  const decayRateFloat = ruleset?.decayRate.toFloat()
  const currentTotalIssuanceRate = ruleset?.weight.toFloat()
  const queuedTotalIssuanceRate = upcomingRuleset ? 
    upcomingRuleset?.weight.toFloat()
  : currentTotalIssuanceRate && decayRateFloat ?
    currentTotalIssuanceRate - (currentTotalIssuanceRate * decayRateFloat)
  : undefined

  const totalIssuanceRateDatum: ConfigurationPanelDatum = useMemo(() => {
    const current = currentTotalIssuanceRate
      ? `${currentTotalIssuanceRate} ${tokenSymbol}/ETH`
      : undefined

    if (upcomingRuleset === null || upcomingRulesetLoading) {
      return pairToDatum(t`Total issuance rate`, current, null)
    }
    const queued = queuedTotalIssuanceRate
      ? `${queuedTotalIssuanceRate} ${tokenSymbol}/ETH`
      : undefined
    return pairToDatum(t`Total issuance rate`, current, queued)
  }, [upcomingRuleset, currentTotalIssuanceRate, tokenSymbol, queuedTotalIssuanceRate, upcomingRulesetLoading])

  const reservedRateFloat = rulesetMetadata?.reservedRate.toFloat()
  const queuedReservedRateFloat = upcomingRulesetMetadata?.reservedRate.toFloat()

  const payerIssuanceRateDatum: ConfigurationPanelDatum = useMemo(() => {
    const currentPayerIssuanceRate = currentTotalIssuanceRate && reservedRateFloat ? 
      currentTotalIssuanceRate - (currentTotalIssuanceRate * reservedRateFloat) 
    : undefined

    const current = currentPayerIssuanceRate
      ? `${currentPayerIssuanceRate} ${tokenSymbol}/ETH`
      : undefined
    if (upcomingRuleset === null || upcomingRulesetMetadata === null || upcomingRulesetLoading) {
      return pairToDatum(t`Payer issuance rate`, current, null)
    }
    const _reservedRate = queuedReservedRateFloat ?? reservedRateFloat
    const queuedPayerIssuanceRate = queuedTotalIssuanceRate && _reservedRate ?
      queuedTotalIssuanceRate - (queuedTotalIssuanceRate * _reservedRate) 
    : undefined
    const queued = queuedPayerIssuanceRate
      ? `${queuedPayerIssuanceRate} ${tokenSymbol}/ETH`
      : undefined
    return pairToDatum(t`Payer issuance rate`, current, queued)
  }, [
    tokenSymbol,
    upcomingRuleset,
    queuedReservedRateFloat,
    upcomingRulesetMetadata,
    currentTotalIssuanceRate,
    queuedTotalIssuanceRate,
    reservedRateFloat,
    upcomingRulesetLoading
  ])

  const reservedRateDatum: ConfigurationPanelDatum = useMemo(() => {
    const current = rulesetMetadata?.reservedRate ? 
      `${rulesetMetadata.reservedRate.formatPercentage()}%` : undefined
    if (upcomingRulesetMetadata === null || upcomingRulesetLoading) {
      return pairToDatum(t`Reserved rate`, current, null)
    }

    const queued = upcomingRulesetMetadata?.reservedRate
      ? `${upcomingRulesetMetadata.reservedRate.formatPercentage()}%`
      : rulesetMetadata?.reservedRate ?
        `${rulesetMetadata.reservedRate.formatPercentage()}%`
      : undefined
    return pairToDatum(t`Reserved rate`, current, queued)
  }, [upcomingRulesetMetadata, rulesetMetadata, upcomingRulesetLoading])

  const decayRateDatum: ConfigurationPanelDatum = useMemo(() => {
    const current = ruleset ? 
      `${ruleset.decayRate.formatPercentage()}%`
      : undefined

    if (upcomingRuleset === null || upcomingRulesetLoading) {
      return pairToDatum(t`Decay rate`, current, null)
    }
    const queued = upcomingRuleset
      ? `${upcomingRuleset.decayRate.formatPercentage()}%`
      : ruleset ?
        `${ruleset.decayRate.formatPercentage()}%`
      : undefined

    return pairToDatum(t`Decay rate`, current, queued)
  }, [ruleset, upcomingRuleset, upcomingRulesetLoading])

  const redemptionRateDatum: ConfigurationPanelDatum = useMemo(() => {
    const currentRedemptionRate = rulesetMetadata?.redemptionRate.formatPercentage()

    const current = currentRedemptionRate
      ? `${currentRedemptionRate}%`
      : undefined

    if (upcomingRulesetMetadata === null || upcomingRulesetLoading) {
      return pairToDatum(t`Redemption rate`, current, null)
    }

    const queued = upcomingRulesetMetadata
      ? `${upcomingRulesetMetadata?.redemptionRate.formatPercentage()}%`
      : rulesetMetadata ?
        `${rulesetMetadata.redemptionRate.formatPercentage()}%`
      : undefined
    return pairToDatum(t`Redemption rate`, current, queued)
  }, [upcomingRulesetMetadata, rulesetMetadata, upcomingRulesetLoading])

  const ownerTokenMintingRateDatum: ConfigurationPanelDatum = useMemo(() => {
    const currentOwnerTokenMintingRate =
      rulesetMetadata?.allowOwnerMinting !== undefined
        ? rulesetMetadata?.allowOwnerMinting
        : undefined
    if (upcomingRulesetMetadata === null || upcomingRulesetLoading) {
      return flagPairToDatum(
        t`Owner token minting`,
        currentOwnerTokenMintingRate,
        null,
      )
    }

    const queuedOwnerTokenMintingRate =
      upcomingRulesetMetadata?.allowOwnerMinting !== undefined ? 
        upcomingRulesetMetadata?.allowOwnerMinting
      : rulesetMetadata?.allowOwnerMinting !== undefined ?
        rulesetMetadata.allowOwnerMinting
      : undefined

    return flagPairToDatum(
      t`Owner token minting`,
      currentOwnerTokenMintingRate,
      queuedOwnerTokenMintingRate,
    )
  }, [rulesetMetadata?.allowOwnerMinting, upcomingRulesetMetadata, upcomingRulesetLoading])

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
        : rulesetMetadata?.pauseCreditTransfers !== undefined ?
          !rulesetMetadata.pauseCreditTransfers
        : null

    return flagPairToDatum(
      t`Token transfers`,
      currentTokenTransfersDatum,
      queuedTokenTransfersDatum,
    )
  }, [
    rulesetMetadata?.pauseCreditTransfers,
    upcomingRulesetMetadata,
    upcomingRulesetLoading
  ])

  return useMemo(() => {
    return {
      totalIssuanceRate: totalIssuanceRateDatum,
      payerIssuanceRate: payerIssuanceRateDatum,
      reservedRate: reservedRateDatum,
      decayRateDatum: decayRateDatum,
      redemptionRate: redemptionRateDatum,
      ownerTokenMintingRate: ownerTokenMintingRateDatum,
      tokenTransfers: tokenTransfersDatum,
    }
  }, [
    decayRateDatum,
    totalIssuanceRateDatum,
    ownerTokenMintingRateDatum,
    payerIssuanceRateDatum,
    redemptionRateDatum,
    reservedRateDatum,
    tokenTransfersDatum,
  ])
}
