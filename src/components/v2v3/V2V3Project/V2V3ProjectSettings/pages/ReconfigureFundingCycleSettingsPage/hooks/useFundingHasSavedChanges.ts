import isEqual from 'lodash/isEqual'
import { NftRewardTier } from 'models/nftRewards'
import { useMemo } from 'react'
import { DEFAULT_MUST_START_AT_OR_AFTER } from 'redux/slices/editingV2Project'
import { tiersEqual } from 'utils/nftRewards'
import {
  serializeFundAccessConstraint,
  serializeV2V3FundingCycleData,
  serializeV2V3FundingCycleMetadata,
} from 'utils/v2v3/serializers'

import { EditingFundingCycleConfig } from './useEditingFundingCycleConfig'
import { InitialEditingData } from './useInitialEditingData'

export const useFundingHasSavedChanges = ({
  editingFundingCycleConfig,
  initialEditingData,
}: {
  editingFundingCycleConfig: EditingFundingCycleConfig
  initialEditingData: InitialEditingData | undefined
}) => {
  const {
    editingPayoutGroupedSplits,
    editingReservedTokensGroupedSplits,
    editingFundingCycleMetadata,
    editingFundingCycleData,
    editingFundAccessConstraints,
    editingNftRewards,
    editingMustStartAtOrAfter,
  } = editingFundingCycleConfig

  const fundingHasSavedChanges = useMemo(() => {
    if (!initialEditingData) {
      // Nothing to compare so return false
      return false
    }
    const editedChanges: InitialEditingData = {
      fundAccessConstraints: editingFundAccessConstraints.map(
        serializeFundAccessConstraint,
      ),
      fundingCycleMetadata: serializeV2V3FundingCycleMetadata(
        editingFundingCycleMetadata,
      ),
      fundingCycleData: serializeV2V3FundingCycleData(editingFundingCycleData),
      payoutGroupedSplits: {
        payoutGroupedSplits: editingPayoutGroupedSplits.splits,
        reservedTokensGroupedSplits: editingReservedTokensGroupedSplits.splits,
      },
      nftRewards: editingNftRewards,
      mustStartAtOrAfter:
        editingMustStartAtOrAfter || DEFAULT_MUST_START_AT_OR_AFTER,
    }

    return !isEqual(initialEditingData, editedChanges)
  }, [
    editingFundAccessConstraints,
    editingFundingCycleData,
    editingFundingCycleMetadata,
    editingPayoutGroupedSplits,
    editingReservedTokensGroupedSplits,
    editingNftRewards,
    initialEditingData,
    editingMustStartAtOrAfter,
  ])

  const fundingDrawerHasSavedChanges = useMemo(() => {
    const fundingCycleData = serializeV2V3FundingCycleData(
      editingFundingCycleData,
    )
    const fundAccessConstraints = editingFundAccessConstraints.length
      ? serializeFundAccessConstraint(editingFundAccessConstraints?.[0])
      : undefined
    const payoutGroupedSplits = editingPayoutGroupedSplits.splits

    if (!fundAccessConstraints || !initialEditingData) {
      return false
    }
    const durationUpdated =
      fundingCycleData.duration !== initialEditingData.fundingCycleData.duration
    const distributionLimitUpdated =
      fundAccessConstraints.distributionLimit !==
      initialEditingData.fundAccessConstraints?.[0]?.distributionLimit
    const distributionLimitCurrencyUpdated =
      fundAccessConstraints.distributionLimitCurrency !==
      initialEditingData.fundAccessConstraints?.[0]?.distributionLimitCurrency
    const payoutGroupedSplitsUpdated = !isEqual(
      payoutGroupedSplits,
      initialEditingData.payoutGroupedSplits?.payoutGroupedSplits ?? [],
    )
    return (
      durationUpdated ||
      distributionLimitUpdated ||
      distributionLimitCurrencyUpdated ||
      payoutGroupedSplitsUpdated
    )
  }, [
    editingFundAccessConstraints,
    editingFundingCycleData,
    editingPayoutGroupedSplits.splits,
    initialEditingData,
  ])

  const tokenDrawerHasSavedChanges = useMemo(() => {
    const fundingCycleData = serializeV2V3FundingCycleData(
      editingFundingCycleData,
    )
    const fundingCycleMetadata = serializeV2V3FundingCycleMetadata(
      editingFundingCycleMetadata,
    )
    const fundAccessConstraints = editingFundAccessConstraints.length
      ? serializeFundAccessConstraint(editingFundAccessConstraints?.[0])
      : undefined
    const reservedTokensGroupedSplits =
      editingReservedTokensGroupedSplits.splits

    if (!fundAccessConstraints || !initialEditingData) {
      return false
    }

    const reservedRateUpdated =
      fundingCycleMetadata.reservedRate !==
      initialEditingData.fundingCycleMetadata.reservedRate
    const reservedTokensGroupedSplitsUpdated = !isEqual(
      reservedTokensGroupedSplits,
      initialEditingData.payoutGroupedSplits.reservedTokensGroupedSplits ?? [],
    )
    const discountRateUpdated =
      fundingCycleData.discountRate !==
      initialEditingData.fundingCycleData.discountRate
    const redemptionRateUpdated =
      fundingCycleMetadata.redemptionRate !==
      initialEditingData.fundingCycleMetadata.redemptionRate

    return (
      reservedRateUpdated ||
      reservedTokensGroupedSplitsUpdated ||
      discountRateUpdated ||
      redemptionRateUpdated
    )
  }, [
    editingFundAccessConstraints,
    editingFundingCycleData,
    editingFundingCycleMetadata,
    editingReservedTokensGroupedSplits.splits,
    initialEditingData,
  ])

  const rulesDrawerHasSavedChanges = useMemo(() => {
    const fundingCycleData = serializeV2V3FundingCycleData(
      editingFundingCycleData,
    )
    const fundingCycleMetadata = serializeV2V3FundingCycleMetadata(
      editingFundingCycleMetadata,
    )
    const fundAccessConstraints = editingFundAccessConstraints.length
      ? serializeFundAccessConstraint(editingFundAccessConstraints?.[0])
      : undefined

    if (!fundAccessConstraints || !initialEditingData) {
      return false
    }

    const pausePaymentsUpdated =
      fundingCycleMetadata.pausePay !==
      initialEditingData.fundingCycleMetadata.pausePay
    const allowMintingUpdated =
      fundingCycleMetadata.allowMinting !==
      initialEditingData.fundingCycleMetadata.allowMinting
    const ballotUpdated =
      fundingCycleData.ballot !== initialEditingData.fundingCycleData.ballot

    return pausePaymentsUpdated || allowMintingUpdated || ballotUpdated
  }, [
    editingFundAccessConstraints,
    editingFundingCycleData,
    editingFundingCycleMetadata,
    initialEditingData,
  ])

  const nftDrawerHasSavedChanges = useMemo(() => {
    const initialNftRewards = initialEditingData?.nftRewards
    if (!editingNftRewards) return false
    if (!initialNftRewards && editingNftRewards) return true

    const rewardTiersChanged = Boolean(
      editingNftRewards.rewardTiers?.some(
        (rewardTier: NftRewardTier, index: number) => {
          const initialRewardTier = initialNftRewards?.rewardTiers?.[index]
          if (!initialRewardTier) return true
          return !tiersEqual({ tier1: rewardTier, tier2: initialRewardTier })
        },
      ),
    )
    return rewardTiersChanged
  }, [initialEditingData, editingNftRewards])

  return {
    fundingHasSavedChanges,
    fundingDrawerHasSavedChanges,
    tokenDrawerHasSavedChanges,
    rulesDrawerHasSavedChanges,
    nftDrawerHasSavedChanges,
  }
}
