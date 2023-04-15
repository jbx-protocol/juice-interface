import {
  combineReducers,
  configureStore,
  EnhancedStore,
} from '@reduxjs/toolkit'
import { getLocalStoragePreloadedState } from './localStoragePreload'
import editingProjectReducer from './slices/editingProject'
import editingV2ProjectReducer from './slices/editingV2Project'

const REDUX_STATE_LOCALSTORAGE_KEY = 'jb_redux_preloadedState'

const rootReducer = combineReducers({
  editingProject: editingProjectReducer,
  editingV2Project: editingV2ProjectReducer,
})

export function createStore(key?: string) {
  return configureStore({
    reducer: rootReducer,
    devTools: process.env.NODE_ENV !== 'production',
    preloadedState: key ? getLocalStoragePreloadedState(key) : undefined,
  })
}

function subscribeStoreToLocalStorage(store: EnhancedStore, key: string) {
  if (typeof window === 'undefined' || !window.localStorage) return

  store.subscribe(() => {
    localStorage.setItem(
      key,
      JSON.stringify({
        reduxState: store.getState(),
      }),
    )
  })
}

const store = createStore(REDUX_STATE_LOCALSTORAGE_KEY)
subscribeStoreToLocalStorage(store, REDUX_STATE_LOCALSTORAGE_KEY)

export type RootState = ReturnType<typeof rootReducer>
export type AppDispatch = typeof store.dispatch

export default store
