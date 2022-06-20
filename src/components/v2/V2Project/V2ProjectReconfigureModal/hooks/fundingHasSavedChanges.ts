import { isEqual } from 'lodash'
import { useMemo } from 'react'
import {
  serializeFundAccessConstraint,
  serializeV2FundingCycleMetadata,
  serializeV2FundingCycleData,
} from 'utils/v2/serializers'

import { EditingProjectData } from './editingProjectData'
import { InitialEditingData } from './initialEditingData'

export const useFundingHasSavedChanges = ({
  editingProjectData,
  initialEditingData,
}: {
  editingProjectData: EditingProjectData
  initialEditingData: InitialEditingData | undefined
}) => {
  const {
    editingPayoutGroupedSplits,
    editingReservedTokensGroupedSplits,
    editingFundingCycleMetadata,
    editingFundingCycleData,
    editingFundAccessConstraints,
  } = editingProjectData

  const fundingHasSavedChanges = useMemo(() => {
    if (!initialEditingData) {
      // Nothing to compare so return false
      return false
    }
    const editedChanges: InitialEditingData = {
      fundAccessConstraints: editingFundAccessConstraints.map(
        serializeFundAccessConstraint,
      ),
      fundingCycleMetadata: serializeV2FundingCycleMetadata(
        editingFundingCycleMetadata,
      ),
      fundingCycleData: serializeV2FundingCycleData(editingFundingCycleData),
      payoutGroupedSplits: {
        payoutGroupedSplits: editingPayoutGroupedSplits.splits,
        reservedTokensGroupedSplits: editingReservedTokensGroupedSplits.splits,
      },
    }
    return !isEqual(initialEditingData, editedChanges)
  }, [
    editingFundAccessConstraints,
    editingFundingCycleData,
    editingFundingCycleMetadata,
    editingPayoutGroupedSplits,
    editingReservedTokensGroupedSplits,
    initialEditingData,
  ])

  const fundingDrawerHasSavedChanges = useMemo(() => {
    const fundingCycleData = serializeV2FundingCycleData(
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
      initialEditingData.fundAccessConstraints?.[0].distributionLimit
    const distributionLimitCurrencyUpdated =
      fundAccessConstraints.distributionLimitCurrency !==
      initialEditingData.fundAccessConstraints?.[0].distributionLimitCurrency
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
    const fundingCycleData = serializeV2FundingCycleData(
      editingFundingCycleData,
    )
    const fundingCycleMetadata = serializeV2FundingCycleMetadata(
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
    const fundingCycleData = serializeV2FundingCycleData(
      editingFundingCycleData,
    )
    const fundingCycleMetadata = serializeV2FundingCycleMetadata(
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

  return {
    fundingHasSavedChanges,
    fundingDrawerHasSavedChanges,
    tokenDrawerHasSavedChanges,
    rulesDrawerHasSavedChanges,
  }
}
