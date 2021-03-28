import { TypedUseSelectorHook, useSelector } from 'react-redux'
import { RootState } from 'redux/store'

import { deserializeBudget } from '../utils/serializers'

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export const useEditingBudgetSelector = () =>
  useAppSelector(state => deserializeBudget(state.editingProject.budget))

export const useEditingBudgetRecurringSelector = () =>
  useAppSelector(state => state.editingProject.budget.discountRate !== '0')
