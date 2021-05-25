import { TypedUseSelectorHook, useSelector } from 'react-redux'
import { RootState } from 'redux/store'
import { deserializeFundingCycle } from 'utils/serializers'

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export const useEditingFundingCycleSelector = () =>
  useAppSelector(state =>
    deserializeFundingCycle(state.editingProject.fundingCycle),
  )

export const useEditingFundingCycleRecurringSelector = () =>
  useAppSelector(
    state => state.editingProject.fundingCycle.discountRate !== '0',
  )
