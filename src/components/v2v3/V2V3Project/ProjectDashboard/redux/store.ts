import { configureStore } from '@reduxjs/toolkit'
import { payRedeemReducer } from './payRedeemSlice'
import { projectCartReducer } from './projectCartSlice'

const store = configureStore({
  reducer: { projectCart: projectCartReducer, payRedeem: payRedeemReducer },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootProjectState = ReturnType<typeof store.getState>
// Inferred type
export type ProjectDispatch = typeof store.dispatch
export type ProjectStore = typeof store

export default store
