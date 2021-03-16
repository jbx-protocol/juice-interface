import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { SerializedBudget } from 'utils/serializers'

export type UserBudgetState = { value: SerializedBudget | undefined | null }

export const userBudgetSlice = createSlice({
  name: 'userBudget',
  initialState: { value: undefined } as UserBudgetState,
  reducers: {
    set: (
      state,
      action: PayloadAction<SerializedBudget | undefined | null>,
    ) => ({
      value: action.payload,
    }),
  },
})

export const userBudgetActions = userBudgetSlice.actions

export default userBudgetSlice.reducer
