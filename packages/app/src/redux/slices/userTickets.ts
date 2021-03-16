import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type UserTicketsState = {
  value:
    | {
        name: string
        symbol: string
        address: string
      }
    | undefined
    | null
}

export const userTicketsSlice = createSlice({
  name: 'userTickets',
  initialState: {
    value: undefined,
  } as UserTicketsState,
  reducers: {
    set: (state, action: PayloadAction<UserTicketsState['value']>) => ({
      value: action.payload,
    }),
  },
})

export const userTicketsActions = userTicketsSlice.actions

export default userTicketsSlice.reducer
