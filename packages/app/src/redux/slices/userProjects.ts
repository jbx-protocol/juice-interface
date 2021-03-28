import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { SerializedBudget } from 'utils/serializers'

export type UserProjectsState = {
  value: Record<string, SerializedBudget | undefined | null>
}

export const userProjectsSlice = createSlice({
  name: 'userBudget',
  initialState: { value: {} } as UserProjectsState,
  reducers: {
    set: (state, action: PayloadAction<UserProjectsState['value']>) => ({
      value: action.payload,
    }),
    upsert: (state, action: PayloadAction<SerializedBudget>) => ({
      ...state,
      value: {
        ...state.value,
        [action.payload.id.toString()]: action.payload,
      },
    }),
  },
})

export const userProjectsActions = userProjectsSlice.actions

export default userProjectsSlice.reducer
