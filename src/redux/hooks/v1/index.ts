import { deserializeV1FundingCycle } from 'packages/v1/utils/serializers'
import { useMemo } from 'react'
import { shallowEqual } from 'react-redux'
import { useAppSelector } from '../useAppSelector'

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
