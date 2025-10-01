import { createSlice } from '@reduxjs/toolkit'
import { JBChainId } from 'juice-sdk-core'

export type PayRedeemState = {
  cardState: 'pay' | 'redeem'
  // TODO: Move projectCart slice here
  chainId: JBChainId | undefined
}

const payRedeemSlice = createSlice({
  name: 'payRedeem',
  initialState: {
    cardState: 'pay',
    chainId: undefined,
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
    setChainId: (state, action) => {
      state.chainId = action.payload
    },
  },
})

export const payRedeemReducer = payRedeemSlice.reducer
export const payRedeemActions = payRedeemSlice.actions

export default payRedeemSlice.reducer
