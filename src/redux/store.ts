import { combineReducers, configureStore } from '@reduxjs/toolkit'

import getLocalStoragePreloadedState from './localStoragePreload'
import editingProjectReducer from './slices/editingProject'
import editingV2ProjectReducer from './slices/editingV2Project'

export const REDUX_STATE_LOCALSTORAGE_KEY = 'jb_redux_preloadedState'

const rootReducer = combineReducers({
  editingProject: editingProjectReducer,
  editingV2Project: editingV2ProjectReducer,
})

export function createStore() {
  return configureStore({
    reducer: rootReducer,
    devTools: process.env.NODE_ENV !== 'production',
    preloadedState: getLocalStoragePreloadedState(),
  })
}

const store = createStore()

store.subscribe(() => {
  localStorage &&
    localStorage.setItem(
      REDUX_STATE_LOCALSTORAGE_KEY,
      JSON.stringify({
        reduxState: store.getState(),
      }),
    )
})

export type RootState = ReturnType<typeof rootReducer>
export type AppDispatch = typeof store.dispatch

export default store
