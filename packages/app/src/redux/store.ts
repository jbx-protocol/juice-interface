import { configureStore } from '@reduxjs/toolkit'

import editingProjectReducer, {
  EditingProjectState,
} from './slices/editingProject'
import userProjectsReducer, { UserProjectsState } from './slices/userProjects'

export type RootState = {
  editingProject: EditingProjectState
  userProjects: UserProjectsState
}

const store = configureStore<RootState>({
  reducer: {
    editingProject: editingProjectReducer,
    userProjects: userProjectsReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
})

export type AppDispatch = typeof store.dispatch

export default store
