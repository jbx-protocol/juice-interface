import { t } from '@lingui/macro'
import {
  ConfigurationPanelTableData,
} from 'components/Project/ProjectTabs/CyclesPayoutsTab/ConfigurationPanel'
import { flagPairToDatum } from 'components/Project/ProjectTabs/utils/flagPairToDatum'
import { pairToDatum } from 'components/Project/ProjectTabs/utils/pairToDatum'
import { ETH_CURRENCY_ID, JBRulesetData, JBRulesetMetadata } from 'juice-sdk-core'
import { useJBTokenContext } from 'juice-sdk-react'
import { useMemo } from 'react'
import { formattedNum } from 'utils/format/formatNumber'
import { tokenSymbolText } from 'utils/tokenSymbolText'

const getCurrencySymbol = (baseCurrency: number | undefined): string => {
  if (baseCurrency === undefined || baseCurrency === ETH_CURRENCY_ID) {
    return 'ETH'
  }
  return 'USD'
}

export const useV4V5FormatTokenSection = (
  ruleset: JBRulesetData | undefined,
  rulesetMetadata: JBRulesetMetadata | undefined,
): ConfigurationPanelTableData => {
  const { token } = useJBTokenContext()
  const tokenSymbolRaw = token?.data?.symbol

  const tokenSymbol = tokenSymbolText({
    tokenSymbol: tokenSymbolRaw,
    capitalize: false,
    plural: true,
  })

  const currencySymbol = getCurrencySymbol(rulesetMetadata?.baseCurrency)

  const totalIssuanceRate = ruleset?.weight.toFloat()
  const totalIssuanceRateFormatted = formattedNum(totalIssuanceRate)
  const reservedPercentFloat = rulesetMetadata?.reservedPercent.toFloat()

  const totalIssuanceRateDatum = useMemo(() => {
    const value =
      totalIssuanceRateFormatted !== undefined
        ? `${totalIssuanceRateFormatted} ${tokenSymbol}/${currencySymbol}`
        : undefined
    return pairToDatum(t`Total issuance rate`, value, null)
  }, [totalIssuanceRateFormatted, tokenSymbol, currencySymbol])

  const payerIssuanceRateDatum = useMemo(() => {
    const payerIssuanceRate =
      typeof totalIssuanceRate !== 'undefined' &&
      typeof reservedPercentFloat !== 'undefined'
        ? totalIssuanceRate - totalIssuanceRate * reservedPercentFloat
        : undefined
    const payerIssuanceRateFormatted = formattedNum(payerIssuanceRate)
    const value =
      payerIssuanceRate !== undefined
        ? `${payerIssuanceRateFormatted} ${tokenSymbol}/${currencySymbol}`
        : undefined
    return pairToDatum(t`Payer issuance rate`, value, null)
  }, [totalIssuanceRate, reservedPercentFloat, tokenSymbol, currencySymbol])

  const reservedPercentDatum = useMemo(() => {
    const value = rulesetMetadata?.reservedPercent
      ? `${rulesetMetadata.reservedPercent.formatPercentage()}%`
      : undefined
    return pairToDatum(t`Reserved rate`, value, null)
  }, [rulesetMetadata?.reservedPercent])

  const weightCutPercentDatum = useMemo(() => {
    const value = ruleset
      ? `${ruleset.weightCutPercent.formatPercentage()}%`
      : undefined
    return pairToDatum(t`Issuance cut percent`, value, null)
  }, [ruleset])

  const cashOutTaxRateDatum = useMemo(() => {
    const value = rulesetMetadata?.cashOutTaxRate
      ? `${rulesetMetadata.cashOutTaxRate.formatPercentage()}%`
      : undefined
    return pairToDatum(t`Cash out tax rate`, value, null)
  }, [rulesetMetadata?.cashOutTaxRate])

  const ownerTokenMintingDatum = useMemo(() => {
    const value = rulesetMetadata?.allowOwnerMinting
    return flagPairToDatum(t`Owner token minting`, value, null)
  }, [rulesetMetadata?.allowOwnerMinting])

  const tokenTransfersDatum = useMemo(() => {
    const value =
      rulesetMetadata?.pauseCreditTransfers !== undefined
        ? !rulesetMetadata.pauseCreditTransfers
        : undefined
    return flagPairToDatum(t`Token transfers`, value, null)
  }, [rulesetMetadata?.pauseCreditTransfers])

  return useMemo(() => {
    return {
      totalIssuanceRate: totalIssuanceRateDatum,
      payerIssuanceRate: payerIssuanceRateDatum,
      reservedPercent: reservedPercentDatum,
      weightCutPercentDatum: weightCutPercentDatum,
      cashOutTaxRate: cashOutTaxRateDatum,
      ownerTokenMintingRate: ownerTokenMintingDatum,
      tokenTransfers: tokenTransfersDatum,
    }
  }, [
    totalIssuanceRateDatum,
    payerIssuanceRateDatum,
    reservedPercentDatum,
    weightCutPercentDatum,
    cashOutTaxRateDatum,
    ownerTokenMintingDatum,
    tokenTransfersDatum,
  ])
}
