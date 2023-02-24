import {
  defaultProjectState as defaultV1ProjectState,
  REDUX_STORE_V1_PROJECT_VERSION,
} from './slices/editingProject'
import { INITIAL_REDUX_STATE as defaultV2ProjectState } from './slices/editingV2Project'
import { REDUX_STORE_V2_PROJECT_VERSION } from './slices/editingV2Project/version'
import { RootState } from './store'

interface PreloadedState {
  reduxState: RootState
}

export function getLocalStoragePreloadedState(
  key: string,
): RootState | undefined {
  try {
    const stateString = localStorage && localStorage.getItem(key)
    if (!stateString) {
      return undefined
    }

    let parsedState: PreloadedState = JSON.parse(stateString)

    // if theres a version mismatch, reset the editingProject state (for Juicebox V1).
    if (
      parsedState?.reduxState?.editingProject?.version !==
      REDUX_STORE_V1_PROJECT_VERSION
    ) {
      parsedState = {
        ...parsedState,
        reduxState: {
          ...parsedState.reduxState,
          editingProject: defaultV1ProjectState,
        },
      }
    }

    // if theres a version mismatch, reset the editingV2Project state
    if (
      parsedState?.reduxState?.editingV2Project?.version !==
      REDUX_STORE_V2_PROJECT_VERSION
    ) {
      console.info(
        'redux::editingV2Project::default redux state changed, resetting editingV2Project state.',
      )
      parsedState = {
        ...parsedState,
        reduxState: {
          ...parsedState.reduxState,
          editingV2Project: defaultV2ProjectState,
        },
      }
    }

    // update local storage with the (maybe) new state
    localStorage && localStorage.setItem(key, JSON.stringify(parsedState))

    return parsedState.reduxState
  } catch (e) {
    return undefined
  }
}
