import { shallowEqual, TypedUseSelectorHook, useSelector } from 'react-redux'
import { RootState } from 'redux/store'
import { deserializeFundingCycle } from 'utils/serializers'
import { useMemo } from 'react'

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export const useEditingFundingCycleSelector = () => {
  const serializedFundingCycle = useAppSelector(
    state => state.editingProject.fundingCycle,
    shallowEqual,
  )

  const fc = useMemo(
    () => deserializeFundingCycle(serializedFundingCycle),
    [serializedFundingCycle],
  )

  return fc
}
