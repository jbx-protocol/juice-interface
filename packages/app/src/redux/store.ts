import { configureStore } from '@reduxjs/toolkit'

import editingBudgetReducer, {
  EditingBudgetState,
} from './slices/editingBudget'
import editingTicketsReducer, {
  EditingTicketsState,
} from './slices/editingTickets'
import userBudgetReducer, { UserBudgetState } from './slices/userBudget'
import userTicketsReducer, { UserTicketsState } from './slices/userTickets'

export type RootState = {
  editingTickets: EditingTicketsState
  editingBudget: EditingBudgetState
  userBudget: UserBudgetState
  userTickets: UserTicketsState
}

const store = configureStore<RootState>({
  reducer: {
    editingTickets: editingTicketsReducer,
    userTickets: userTicketsReducer,
    editingBudget: editingBudgetReducer,
    userBudget: userBudgetReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
})

export type AppDispatch = typeof store.dispatch

export default store
