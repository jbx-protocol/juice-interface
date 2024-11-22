import {
  deserializeFundAccessConstraint,
  deserializeV2V3FundingCycleData,
  deserializeV2V3FundingCycleMetadata,
} from 'packages/v2v3/utils/serializers'
import { useMemo } from 'react'
import { shallowEqual } from 'react-redux'
import { useAppSelector } from 'redux/hooks/useAppSelector'

export const useEditingV2V3FundingCycleMetadataSelector = () => {
  const serializedFundingCycleMetadata = useAppSelector(
    state => state.editingV2Project.fundingCycleMetadata,
    shallowEqual,
  )

  const fundingCycleMetadata = useMemo(
    () => deserializeV2V3FundingCycleMetadata(serializedFundingCycleMetadata),
    [serializedFundingCycleMetadata],
  )

  // force useDataSourceForPay to false, for safety.
  // https://github.com/jbx-protocol/juice-interface/issues/1473
  fundingCycleMetadata.useDataSourceForPay = false

  return fundingCycleMetadata
}

export const useEditingV2V3FundingCycleDataSelector = () => {
  const serializedFundingCycleData = useAppSelector(
    state => state.editingV2Project.fundingCycleData,
    shallowEqual,
  )

  const fundingCycleData = useMemo(
    () => deserializeV2V3FundingCycleData(serializedFundingCycleData),
    [serializedFundingCycleData],
  )

  return fundingCycleData
}

export const useEditingV2V3FundAccessConstraintsSelector = () => {
  const serializedFundAccessConstraints = useAppSelector(
    state => state.editingV2Project.fundAccessConstraints,
    shallowEqual,
  )

  const fundAccessConstraints = useMemo(
    () =>
      serializedFundAccessConstraints.map(d =>
        deserializeFundAccessConstraint(d),
      ),
    [serializedFundAccessConstraints],
  )

  return fundAccessConstraints
}
