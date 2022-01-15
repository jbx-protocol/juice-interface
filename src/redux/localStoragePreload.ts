import { Middleware } from '@reduxjs/toolkit'

import { defaultProjectState } from './slices/editingProject'

import { RootState } from './store'

const KEY = 'jb_redux_preloadedState'

interface PreloadedState {
  reduxState: RootState
}

export const localStoragePreloadMiddleware: Middleware =
  store => next => action => {
    if (typeof localStorage === 'undefined') {
      return
    }
    localStorage.setItem(
      KEY,
      JSON.stringify({
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

    // If the localStorage `version` is the same, we can proceed and
    // hydrate our preloaded state with it.
    // If not, we should effectively discard it.
    if (
      parsedState?.reduxState?.editingProject?.version ===
      defaultProjectState.version
    ) {
      return parsedState.reduxState
    } else {
      localStorage.removeItem(stateString)
    }
  } catch (e) {
    return undefined
  }
}
