import { configureStore } from '@reduxjs/toolkit'

import editingProjectReducer, {
  EditingProjectState,
} from './slices/editingProject'

export type RootState = {
  editingProject: EditingProjectState
}

const store = configureStore<RootState>({
  reducer: {
    editingProject: editingProjectReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
})

export type AppDispatch = typeof store.dispatch

export default store
