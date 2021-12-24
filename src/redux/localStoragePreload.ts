import { RootState } from './store'
import { Middleware } from '@reduxjs/toolkit'

const KEY = 'jb_redux_preloadedState'

interface PreloadedState {
  // Date last updated
  lastUpdated: number
  reduxState: RootState
}

export const localStoragePreloadMiddleware: Middleware = store => next => action => {
  if (typeof localStorage === 'undefined') {
    return
  }
  localStorage.setItem(
    KEY,
    JSON.stringify({
      lastUpdated: Date.now(),
      reduxState: store.getState(),
    } as PreloadedState),
  )

  return next(action)
}

export default function getLocalStoragePreloadedState(): RootState | undefined {
  try {
    const stateString = localStorage.getItem(KEY)
    if (!stateString) {
      return undefined
    }

    const parsedState: PreloadedState = JSON.parse(stateString)

    // If the localStorage state is valid but over 2 days old, discard it.
    // We don't want to try hydrating an invalid state causing some unusual UX.
    if (
      parsedState.reduxState &&
      parsedState.lastUpdated &&
      Date.now() - parsedState.lastUpdated > 1.728e8
    ) {
      return parsedState.reduxState
    } else {
      localStorage.removeItem(stateString)
    }
  } catch (e) {
    return undefined
  }
}
