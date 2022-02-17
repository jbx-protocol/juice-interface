import { shallowEqual, TypedUseSelectorHook, useSelector } from 'react-redux'
import { RootState } from 'redux/store'
import { deserializeV1FundingCycle } from 'utils/v1/serializers'
import { useMemo } from 'react'
import {
  deserializeFundAccessConstraint,
  deserializeV2FundingCycleData,
  deserializeV2FundingCycleMetadata,
} from 'utils/v2/serializers'

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

export const useEditingV2FundingCycleMetadataSelector = () => {
  const serializedFundingCycleMetadata = useAppSelector(
    state => state.editingV2Project.fundingCycleMetadata,
    shallowEqual,
  )

  const fundingCycleMetadata = useMemo(
    () => deserializeV2FundingCycleMetadata(serializedFundingCycleMetadata),
    [serializedFundingCycleMetadata],
  )

  return fundingCycleMetadata
}

export const useEditingV2FundingCycleDataSelector = () => {
  const serializedFundingCycleData = useAppSelector(
    state => state.editingV2Project.fundingCycleData,
    shallowEqual,
  )

  const fundingCycleData = useMemo(
    () => deserializeV2FundingCycleData(serializedFundingCycleData),
    [serializedFundingCycleData],
  )

  return fundingCycleData
}

export const useEditingV2FundAccessConstraintsSelector = () => {
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
