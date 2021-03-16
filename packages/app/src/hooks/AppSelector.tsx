import { TypedUseSelectorHook, useSelector } from 'react-redux'
import { RootState } from 'redux/store'

import { deserializeBudget } from '../utils/serializers'

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export const useUserBudgetSelector = () =>
  useAppSelector(state => deserializeBudget(state.userBudget.value))

export const useEditingBudgetSelector = () =>
  useAppSelector(state => deserializeBudget(state.editingBudget.value))
