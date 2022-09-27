import { useMemo } from 'react'
import { shallowEqual, TypedUseSelectorHook, useSelector } from 'react-redux'
import { RootState } from 'redux/store'
import { deserializeV1FundingCycle } from 'utils/v1/serializers'
import {
  deserializeFundAccessConstraint,
  deserializeV2V3FundingCycleData,
  deserializeV2V3FundingCycleMetadata,
} from 'utils/v2v3/serializers'

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export const useEditingV1FundingCycleSelector = () => {
  const serializedFundingCycle = useAppSelector(
    state => state.editingProject.fundingCycle,
    shallowEqual,
  )

  const fc = useMemo(
    () => deserializeV1FundingCycle(serializedFundingCycle),
    [serializedFundingCycle],
  )

  return fc
}

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
