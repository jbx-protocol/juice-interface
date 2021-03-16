import { configureStore } from '@reduxjs/toolkit'

import editingBudgetReducer, {
  EditingBudgetState,
} from './slices/editingBudget'
import userBudgetReducer, { UserBudgetState } from './slices/userBudget'
import userTicketsReducer, { UserTicketsState } from './slices/userTickets'

export type RootState = {
  editingBudget: EditingBudgetState
  userBudget: UserBudgetState
  userTickets: UserTicketsState
}

const store = configureStore<RootState>({
  reducer: {
    userTickets: userTicketsReducer,
    editingBudget: editingBudgetReducer,
    userBudget: userBudgetReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
})

export type AppDispatch = typeof store.dispatch

export default store
