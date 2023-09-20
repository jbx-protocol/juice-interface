import { t } from '@lingui/macro'
import {
  V2V3FundingCycle,
  V2V3FundingCycleMetadata,
} from 'models/v2v3/fundingCycle'
import { useMemo } from 'react'
import { formattedNum } from 'utils/format/formatNumber'
import { tokenSymbolText } from 'utils/tokenSymbolText'
import {
  computeIssuanceRate,
  formatDiscountRate,
  formatIssuanceRate,
  formatRedemptionRate,
  formatReservedRate,
} from 'utils/v2v3/math'
import {
  ConfigurationPanelDatum,
  ConfigurationPanelTableData,
} from '../../components/ConfigurationPanel'
import { flagPairToDatum } from '../../utils/flagPairToDatum'
import { pairToDatum } from '../../utils/pairToDatum'

export const useFormatConfigurationTokenSection = ({
  fundingCycle,
  fundingCycleMetadata,
  tokenSymbol: tokenSymbolRaw,
  upcomingFundingCycle,
  upcomingFundingCycleMetadata,
}: {
  fundingCycle: V2V3FundingCycle | undefined
  fundingCycleMetadata: V2V3FundingCycleMetadata | undefined
  tokenSymbol: string | undefined
  upcomingFundingCycle?: V2V3FundingCycle | undefined | null
  upcomingFundingCycleMetadata?: V2V3FundingCycleMetadata | undefined | null
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

  const totalIssueanceRateDatum: ConfigurationPanelDatum = useMemo(() => {
    const currentTotalIssueanceRate = fundingCycle?.weight.toString()
    const current = currentTotalIssueanceRate
      ? `${formattedNum(
          formatIssuanceRate(currentTotalIssueanceRate),
        )} ${tokenSymbol}/ETH`
      : undefined
    if (upcomingFundingCycle === null) {
      return pairToDatum(t`Total issuance rate`, current, null)
    }

    const upcomingTotalIssueanceRate = upcomingFundingCycle?.weight.toString()
    const upcoming = upcomingTotalIssueanceRate
      ? `${formattedNum(
          formatIssuanceRate(upcomingTotalIssueanceRate),
        )} ${tokenSymbol}/ETH`
      : undefined
    return pairToDatum(t`Total issuance rate`, current, upcoming)
  }, [fundingCycle?.weight, tokenSymbol, upcomingFundingCycle])

  const payerIssuanceRateDatum: ConfigurationPanelDatum = useMemo(() => {
    const currentPayerIssuanceRate =
      fundingCycle && fundingCycleMetadata
        ? computeIssuanceRate(fundingCycle, fundingCycleMetadata, 'payer')
        : undefined
    const current = currentPayerIssuanceRate
      ? `${currentPayerIssuanceRate} ${tokenSymbol}/ETH`
      : undefined
    if (
      upcomingFundingCycle === null ||
      upcomingFundingCycleMetadata === null
    ) {
      return pairToDatum(t`Payer issuance rate`, current, null)
    }

    const upcomingPayerIssuanceRate =
      upcomingFundingCycle && upcomingFundingCycleMetadata
        ? computeIssuanceRate(
            upcomingFundingCycle,
            upcomingFundingCycleMetadata,
            'payer',
          )
        : undefined
    const upcoming = upcomingPayerIssuanceRate
      ? `${upcomingPayerIssuanceRate} ${tokenSymbol}/ETH`
      : undefined
    return pairToDatum(t`Payer issuance rate`, current, upcoming)
  }, [
    fundingCycle,
    fundingCycleMetadata,
    tokenSymbol,
    upcomingFundingCycle,
    upcomingFundingCycleMetadata,
  ])

  const reservedRateDatum: ConfigurationPanelDatum = useMemo(() => {
    const currentReservedRate = fundingCycleMetadata?.reservedRate
      ? formatReservedRate(fundingCycleMetadata?.reservedRate)
      : undefined
    const current = currentReservedRate ? `${currentReservedRate}%` : undefined
    if (upcomingFundingCycleMetadata === null) {
      return pairToDatum(t`Reserved rate`, current, null)
    }

    const upcomingReservedRate = upcomingFundingCycleMetadata?.reservedRate
      ? formatReservedRate(upcomingFundingCycleMetadata?.reservedRate)
      : undefined
    const upcoming = upcomingReservedRate
      ? `${upcomingReservedRate}%`
      : undefined
    return pairToDatum(t`Reserved rate`, current, upcoming)
  }, [fundingCycleMetadata?.reservedRate, upcomingFundingCycleMetadata])

  const issueanceReductionRateDatum: ConfigurationPanelDatum = useMemo(() => {
    const currentIssueanceReductionRate = fundingCycle
      ? formatDiscountRate(fundingCycle?.discountRate.toString())
      : undefined
    const current = currentIssueanceReductionRate
      ? `${currentIssueanceReductionRate}%`
      : undefined

    if (upcomingFundingCycle === null) {
      return pairToDatum(t`Issuance reduction rate`, current, null)
    }

    const upcomingIssueanceReductionRate = upcomingFundingCycle
      ? formatDiscountRate(upcomingFundingCycle?.discountRate.toString())
      : undefined
    const upcoming = upcomingIssueanceReductionRate
      ? `${upcomingIssueanceReductionRate}%`
      : undefined
    return pairToDatum(t`Issuance reduction rate`, current, upcoming)
  }, [fundingCycle, upcomingFundingCycle])

  const redemptionRateDatum: ConfigurationPanelDatum = useMemo(() => {
    const currentRedemptionRate = fundingCycleMetadata?.redemptionRate
      ? formatRedemptionRate(fundingCycleMetadata?.redemptionRate)
      : undefined
    const current = currentRedemptionRate
      ? `${currentRedemptionRate}%`
      : undefined

    if (upcomingFundingCycleMetadata === null) {
      return pairToDatum(t`Redemption rate`, current, null)
    }

    const upcomingRedemptionRate = upcomingFundingCycleMetadata?.redemptionRate
      ? formatRedemptionRate(upcomingFundingCycleMetadata?.redemptionRate)
      : undefined
    const upcoming = upcomingRedemptionRate
      ? `${upcomingRedemptionRate}%`
      : undefined
    return pairToDatum(t`Redemption rate`, current, upcoming)
  }, [fundingCycleMetadata?.redemptionRate, upcomingFundingCycleMetadata])

  const ownerTokenMintingRateDatum: ConfigurationPanelDatum = useMemo(() => {
    const currentOwnerTokenMintingRate =
      fundingCycleMetadata?.allowMinting !== undefined
        ? fundingCycleMetadata?.allowMinting
        : undefined
    if (upcomingFundingCycleMetadata === null) {
      return flagPairToDatum(
        t`Owner token minting`,
        currentOwnerTokenMintingRate,
        null,
      )
    }

    const upcomingOwnerTokenMintingRate =
      upcomingFundingCycleMetadata?.allowMinting !== undefined
        ? upcomingFundingCycleMetadata?.allowMinting
        : undefined

    return flagPairToDatum(
      t`Owner token minting`,
      currentOwnerTokenMintingRate,
      upcomingOwnerTokenMintingRate,
    )
  }, [fundingCycleMetadata?.allowMinting, upcomingFundingCycleMetadata])

  const tokenTransfersDatum: ConfigurationPanelDatum = useMemo(() => {
    const currentTokenTransfersDatum =
      fundingCycleMetadata?.global.pauseTransfers !== undefined
        ? !fundingCycleMetadata?.global.pauseTransfers
        : undefined
    if (upcomingFundingCycleMetadata === null) {
      return flagPairToDatum(
        t`Token transfers`,
        !!currentTokenTransfersDatum,
        null,
      )
    }
    const upcomingTokenTransfersDatum =
      upcomingFundingCycleMetadata?.global.pauseTransfers !== undefined
        ? !upcomingFundingCycleMetadata?.global.pauseTransfers
        : undefined

    return flagPairToDatum(
      t`Token transfers`,
      currentTokenTransfersDatum,
      upcomingTokenTransfersDatum,
    )
  }, [
    fundingCycleMetadata?.global.pauseTransfers,
    upcomingFundingCycleMetadata,
  ])

  return useMemo(() => {
    return {
      totalIssueanceRate: totalIssueanceRateDatum,
      payerIssuanceRate: payerIssuanceRateDatum,
      reservedRate: reservedRateDatum,
      issueanceReductionRate: issueanceReductionRateDatum,
      redemptionRate: redemptionRateDatum,
      ownerTokenMintingRate: ownerTokenMintingRateDatum,
      tokenTransfers: tokenTransfersDatum,
    }
  }, [
    issueanceReductionRateDatum,
    ownerTokenMintingRateDatum,
    payerIssuanceRateDatum,
    redemptionRateDatum,
    reservedRateDatum,
    tokenTransfersDatum,
    totalIssueanceRateDatum,
  ])
}
