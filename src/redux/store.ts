import { combineReducers, configureStore } from '@reduxjs/toolkit'

import editingProjectReducer from './slices/editingProject'
import getLocalStoragePreloadedState, {
  localStoragePreloadMiddleware,
} from './localStoragePreload'

const rootReducer = combineReducers({
  editingProject: editingProjectReducer,
})

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production',
  preloadedState: getLocalStoragePreloadedState(),
  middleware: getDefaultMiddleware => [
    ...getDefaultMiddleware(),
    localStoragePreloadMiddleware,
  ],
})

export type RootState = ReturnType<typeof rootReducer>
export type AppDispatch = typeof store.dispatch

export default store
