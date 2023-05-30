import { t } from '@lingui/macro'
import {
  useProjectContext,
  useProjectMetadata,
} from 'components/ProjectDashboard/hooks'
import { useProjectUpcomingFundingCycle } from 'hooks/v2v3/contractReader/useProjectUpcomingFundingCycle'
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

export const useTokenSection = (
  type: 'current' | 'upcoming',
): ConfigurationPanelTableData => {
  const { projectId } = useProjectMetadata()

  const {
    fundingCycle,
    fundingCycleMetadata,
    tokenSymbol: tokenSymbolRaw,
  } = useProjectContext()
  const { data: upcomingFundingCycleData } = useProjectUpcomingFundingCycle({
    projectId,
  })
  const [upcomingFundingCycle, upcomingFundingCycleMetadata] =
    upcomingFundingCycleData ?? []

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
    const upcomingTotalIssueanceRate = upcomingFundingCycle?.weight.toString()
    const current = currentTotalIssueanceRate
      ? `${formattedNum(
          formatIssuanceRate(currentTotalIssueanceRate),
        )} ${tokenSymbol}/ETH`
      : undefined
    const upcoming = upcomingTotalIssueanceRate
      ? `${formattedNum(
          formatIssuanceRate(upcomingTotalIssueanceRate),
        )} ${tokenSymbol}/ETH`
      : undefined
    return pairToDatum(t`Total issuance rate`, type, current, upcoming)
  }, [fundingCycle?.weight, tokenSymbol, type, upcomingFundingCycle?.weight])

  const payerIssuanceRateDatum: ConfigurationPanelDatum = useMemo(() => {
    const currentPayerIssuanceRate =
      fundingCycle && fundingCycleMetadata
        ? computeIssuanceRate(fundingCycle, fundingCycleMetadata, 'payer')
        : undefined
    const upcomingPayerIssuanceRate =
      upcomingFundingCycle && upcomingFundingCycleMetadata
        ? computeIssuanceRate(
            upcomingFundingCycle,
            upcomingFundingCycleMetadata,
            'payer',
          )
        : undefined
    const current = currentPayerIssuanceRate
      ? `${currentPayerIssuanceRate} ${tokenSymbol}/ETH`
      : undefined
    const upcoming = upcomingPayerIssuanceRate
      ? `${upcomingPayerIssuanceRate} ${tokenSymbol}/ETH`
      : undefined
    return pairToDatum(t`Payer issuance rate`, type, current, upcoming)
  }, [
    fundingCycle,
    fundingCycleMetadata,
    tokenSymbol,
    type,
    upcomingFundingCycle,
    upcomingFundingCycleMetadata,
  ])

  const reservedRateDatum: ConfigurationPanelDatum = useMemo(() => {
    const currentReservedRate = fundingCycleMetadata?.reservedRate
      ? formatReservedRate(fundingCycleMetadata?.reservedRate)
      : undefined
    const upcomingReservedRate = upcomingFundingCycleMetadata?.reservedRate
      ? formatReservedRate(upcomingFundingCycleMetadata?.reservedRate)
      : undefined
    const current = currentReservedRate ? `${currentReservedRate}%` : undefined
    const upcoming = upcomingReservedRate
      ? `${upcomingReservedRate}%`
      : undefined
    return pairToDatum(t`Reserved rate`, type, current, upcoming)
  }, [
    fundingCycleMetadata?.reservedRate,
    type,
    upcomingFundingCycleMetadata?.reservedRate,
  ])

  const issueanceReductionRateDatum: ConfigurationPanelDatum = useMemo(() => {
    const currentIssueanceReductionRate = fundingCycle
      ? formatDiscountRate(fundingCycle?.discountRate.toString())
      : undefined
    const upcomingIssueanceReductionRate = upcomingFundingCycle
      ? formatDiscountRate(upcomingFundingCycle?.discountRate.toString())
      : undefined
    const current = currentIssueanceReductionRate
      ? `${currentIssueanceReductionRate}%`
      : undefined
    const upcoming = upcomingIssueanceReductionRate
      ? `${upcomingIssueanceReductionRate}%`
      : undefined
    return pairToDatum(t`Issuance reduction rate`, type, current, upcoming)
  }, [fundingCycle, type, upcomingFundingCycle])

  const redemptionRateDatum: ConfigurationPanelDatum = useMemo(() => {
    const currentRedemptionRate = fundingCycleMetadata?.redemptionRate
      ? formatRedemptionRate(fundingCycleMetadata?.redemptionRate)
      : undefined
    const upcomingRedemptionRate = upcomingFundingCycleMetadata?.redemptionRate
      ? formatRedemptionRate(upcomingFundingCycleMetadata?.redemptionRate)
      : undefined
    const current = currentRedemptionRate
      ? `${currentRedemptionRate}%`
      : undefined
    const upcoming = upcomingRedemptionRate
      ? `${upcomingRedemptionRate}%`
      : undefined
    return pairToDatum(t`Redemption rate`, type, current, upcoming)
  }, [
    fundingCycleMetadata?.redemptionRate,
    type,
    upcomingFundingCycleMetadata?.redemptionRate,
  ])

  const ownerTokenMintingRateDatum: ConfigurationPanelDatum = useMemo(() => {
    const currentOwnerTokenMintingRate =
      fundingCycleMetadata?.allowMinting !== undefined
        ? fundingCycleMetadata?.allowMinting
        : undefined
    const upcomingOwnerTokenMintingRate =
      upcomingFundingCycleMetadata?.allowMinting !== undefined
        ? upcomingFundingCycleMetadata?.allowMinting
        : undefined

    return flagPairToDatum(
      t`Owner token minting`,
      type,
      currentOwnerTokenMintingRate,
      upcomingOwnerTokenMintingRate,
    )
  }, [
    fundingCycleMetadata?.allowMinting,
    type,
    upcomingFundingCycleMetadata?.allowMinting,
  ])

  const tokenTransfersDatum: ConfigurationPanelDatum = useMemo(() => {
    const currentTokenTransfersDatum =
      fundingCycleMetadata?.global.pauseTransfers !== undefined
        ? !fundingCycleMetadata?.global.pauseTransfers
        : undefined
    const upcomingTokenTransfersDatum =
      upcomingFundingCycleMetadata?.global.pauseTransfers !== undefined
        ? !upcomingFundingCycleMetadata?.global.pauseTransfers
        : undefined

    return flagPairToDatum(
      t`Token transfers`,
      type,
      currentTokenTransfersDatum,
      upcomingTokenTransfersDatum,
    )
  }, [
    fundingCycleMetadata?.global.pauseTransfers,
    type,
    upcomingFundingCycleMetadata?.global.pauseTransfers,
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
