import { configureStore } from '@reduxjs/toolkit'
import { projectCartReducer } from './projectCartSlice'

const store = configureStore({
  reducer: { projectCart: projectCartReducer },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootProjectState = ReturnType<typeof store.getState>
// Inferred type
export type ProjectDispatch = typeof store.dispatch
export type ProjectStore = typeof store

export default store
