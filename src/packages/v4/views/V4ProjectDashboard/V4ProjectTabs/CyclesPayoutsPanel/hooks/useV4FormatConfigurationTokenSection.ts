import { t } from '@lingui/macro'
import { flagPairToDatum } from 'components/Project/ProjectHeader/utils/flagPairToDatum'
import { pairToDatum } from 'components/Project/ProjectHeader/utils/pairToDatum'
import {
  ConfigurationPanelDatum,
  ConfigurationPanelTableData,
} from 'components/Project/ProjectTabs/CyclesPayoutsTab/ConfigurationPanel'


import { Ruleset } from 'packages/v4/models/ruleset'
import { RulesetMetadata } from 'packages/v4/models/rulesetMetadata'
import { useMemo } from 'react'
import { tokenSymbolText } from 'utils/tokenSymbolText'

export const useV4FormatConfigurationTokenSection = ({
  ruleset,
  rulesetMetadata,
  tokenSymbol: tokenSymbolRaw,
  queuedRuleset,
  queuedRulesetMetadata,
}: {
  ruleset: Ruleset | undefined | null
  rulesetMetadata: RulesetMetadata | undefined | null
  tokenSymbol: string | undefined
  queuedRuleset: Ruleset | undefined | null
  queuedRulesetMetadata?: RulesetMetadata | undefined | null
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
  const queuedTotalIssuanceRate = queuedRuleset ? 
    queuedRuleset?.weight.toFloat()
  : currentTotalIssuanceRate && decayRateFloat ?
    currentTotalIssuanceRate - (currentTotalIssuanceRate * decayRateFloat)
  : undefined

  const totalIssuanceRateDatum: ConfigurationPanelDatum = useMemo(() => {
    const current = currentTotalIssuanceRate
      ? `${currentTotalIssuanceRate} ${tokenSymbol}/ETH`
      : undefined

    if (queuedRuleset === null) {
      return pairToDatum(t`Total issuance rate`, current, null)
    }
    const queued = queuedTotalIssuanceRate
      ? `${queuedTotalIssuanceRate} ${tokenSymbol}/ETH`
      : undefined
    return pairToDatum(t`Total issuance rate`, current, queued)
  }, [queuedRuleset, currentTotalIssuanceRate, tokenSymbol, queuedTotalIssuanceRate])

  const reservedRateFloat = rulesetMetadata?.reservedRate.toFloat()
  const queuedReservedRateFloat = queuedRulesetMetadata?.reservedRate.toFloat()

  const payerIssuanceRateDatum: ConfigurationPanelDatum = useMemo(() => {
    const currentPayerIssuanceRate = currentTotalIssuanceRate && reservedRateFloat ? 
      currentTotalIssuanceRate - (currentTotalIssuanceRate * reservedRateFloat) 
    : undefined

    const current = currentPayerIssuanceRate
      ? `${currentPayerIssuanceRate} ${tokenSymbol}/ETH`
      : undefined
    if (queuedRuleset === null || queuedRulesetMetadata === null) {
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
    queuedRuleset,
    queuedReservedRateFloat,
    queuedRulesetMetadata,
    currentTotalIssuanceRate,
    queuedTotalIssuanceRate,
    reservedRateFloat,
  ])

  const reservedRateDatum: ConfigurationPanelDatum = useMemo(() => {
    const current = rulesetMetadata?.reservedRate ? 
      `${rulesetMetadata.reservedRate.formatPercentage()}%` : undefined
    if (queuedRulesetMetadata === null) {
      return pairToDatum(t`Reserved rate`, current, null)
    }

    const queued = queuedRulesetMetadata?.reservedRate
      ? `${queuedRulesetMetadata.reservedRate.formatPercentage()}%`
      : rulesetMetadata?.reservedRate ?
        `${rulesetMetadata.reservedRate.formatPercentage()}%`
      : undefined
    return pairToDatum(t`Reserved rate`, current, queued)
  }, [queuedRulesetMetadata, rulesetMetadata])

  const decayRateDatum: ConfigurationPanelDatum = useMemo(() => {
    const current = ruleset ? 
      `${ruleset.decayRate.formatPercentage()}%`
      : undefined

    if (queuedRuleset === null) {
      return pairToDatum(t`Decay rate`, current, null)
    }

    const queued = queuedRuleset
      ? `${queuedRuleset.decayRate.formatPercentage}%`
      : ruleset ?
        `${ruleset.decayRate.formatPercentage()}%`
      : undefined

    return pairToDatum(t`Decay rate`, current, queued)
  }, [ruleset, queuedRuleset])

  const redemptionRateDatum: ConfigurationPanelDatum = useMemo(() => {
    const currentRedemptionRate = rulesetMetadata?.redemptionRate.formatPercentage()

    const current = currentRedemptionRate
      ? `${currentRedemptionRate}%`
      : undefined

    if (queuedRulesetMetadata === null) {
      return pairToDatum(t`Redemption rate`, current, null)
    }

    const queued = queuedRulesetMetadata
      ? `${queuedRulesetMetadata?.redemptionRate.formatPercentage()}%`
      : rulesetMetadata ?
        `${rulesetMetadata.redemptionRate.formatPercentage()}%`
      : undefined
    return pairToDatum(t`Redemption rate`, current, queued)
  }, [queuedRulesetMetadata, rulesetMetadata])

  const ownerTokenMintingRateDatum: ConfigurationPanelDatum = useMemo(() => {
    const currentOwnerTokenMintingRate =
      rulesetMetadata?.allowOwnerMinting !== undefined
        ? rulesetMetadata?.allowOwnerMinting
        : undefined
    if (queuedRulesetMetadata === null) {
      return flagPairToDatum(
        t`Owner token minting`,
        currentOwnerTokenMintingRate,
        null,
      )
    }

    const queuedOwnerTokenMintingRate =
      queuedRulesetMetadata?.allowOwnerMinting !== undefined ? 
        queuedRulesetMetadata?.allowOwnerMinting
      : rulesetMetadata?.allowOwnerMinting !== undefined ?
        rulesetMetadata.allowOwnerMinting
      : undefined

    return flagPairToDatum(
      t`Owner token minting`,
      currentOwnerTokenMintingRate,
      queuedOwnerTokenMintingRate,
    )
  }, [rulesetMetadata?.allowOwnerMinting, queuedRulesetMetadata])

  const tokenTransfersDatum: ConfigurationPanelDatum = useMemo(() => {
    const currentTokenTransfersDatum =
      rulesetMetadata?.pauseCreditTransfers !== undefined
        ? !rulesetMetadata?.pauseCreditTransfers
        : undefined
    if (queuedRulesetMetadata === null) {
      return flagPairToDatum(
        t`Token transfers`,
        !!currentTokenTransfersDatum,
        null,
      )
    }
    const queuedTokenTransfersDatum =
      queuedRulesetMetadata?.pauseCreditTransfers !== undefined
        ? !queuedRulesetMetadata?.pauseCreditTransfers
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
    queuedRulesetMetadata,
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
