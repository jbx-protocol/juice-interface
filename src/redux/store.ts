import { combineReducers, configureStore } from '@reduxjs/toolkit'

import editingProjectReducer from './slices/editingProject'
import getLocalStoragePreloadedState, {
  localStoragePreloadMiddleware,
} from './localStoragePreload'

const rootReducer = combineReducers({
  editingProject: editingProjectReducer,
})

export function createStore() {
  return configureStore({
    reducer: rootReducer,
    devTools: process.env.NODE_ENV !== 'production',
    preloadedState: getLocalStoragePreloadedState(),
    middleware: getDefaultMiddleware => [
      ...getDefaultMiddleware(),
      localStoragePreloadMiddleware,
    ],
  })
}

const store = createStore()

export type RootState = ReturnType<typeof rootReducer>
export type AppDispatch = typeof store.dispatch

export default store
