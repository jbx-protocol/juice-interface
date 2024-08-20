import { createSlice } from '@reduxjs/toolkit'

export type PayRedeemState = {
  cardState: 'pay' | 'redeem'
  // TODO: Move projectCart slice here
}

const payRedeemSlice = createSlice({
  name: 'payRedeem',
  initialState: {
    cardState: 'pay',
  } as PayRedeemState,
  reducers: {
    changeToPay: state => {
      state.cardState = 'pay'
    },
    changeToRedeem: state => {
      state.cardState = 'redeem'
    },
    reset: state => {
      state.cardState = 'pay'
    },
  },
})

export const payRedeemReducer = payRedeemSlice.reducer
export const payRedeemActions = payRedeemSlice.actions

export default payRedeemSlice.reducer
