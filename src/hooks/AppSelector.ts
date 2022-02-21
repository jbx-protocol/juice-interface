import { shallowEqual, TypedUseSelectorHook, useSelector } from 'react-redux'
import { RootState } from 'redux/store'
import { deserializeV1FundingCycle } from 'utils/v1/serializers'
import { useMemo } from 'react'

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
