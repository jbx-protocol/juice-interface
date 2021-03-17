import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type EditingTicketsState = {
  name: string | undefined
  symbol: string | undefined
}

export const editingTicketsSlice = createSlice({
  name: 'editingTickets',
  initialState: {
    name: undefined,
    symbol: undefined,
  } as EditingTicketsState,
  reducers: {
    set: (state, action: PayloadAction<EditingTicketsState>) => action.payload,
    setName: (state, action: PayloadAction<string>) => ({
      ...state,
      name: action.payload,
    }),
    setSymbol: (state, action: PayloadAction<string>) => ({
      ...state,
      symbol: action.payload,
    }),
  },
})

export const editingTicketsActions = editingTicketsSlice.actions

export default editingTicketsSlice.reducer
