import {
  defaultProjectState as defaultV1ProjectState,
  REDUX_STORE_V1_PROJECT_VERSION,
} from './slices/editingProject'
import {
  DEFAULT_REDUX_STATE as defaultV2ProjectState,
  REDUX_STORE_V2_PROJECT_VERSION,
} from './slices/editingV2Project'
import { REDUX_STATE_LOCALSTORAGE_KEY, RootState } from './store'

interface PreloadedState {
  reduxState: RootState
}

export default function getLocalStoragePreloadedState(): RootState | undefined {
  try {
    const stateString =
      localStorage && localStorage.getItem(REDUX_STATE_LOCALSTORAGE_KEY)
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
      parsedState = {
        ...parsedState,
        reduxState: {
          ...parsedState.reduxState,
          editingV2Project: defaultV2ProjectState,
        },
      }
    }

    // update local storage with the (maybe) new state
    localStorage &&
      localStorage.setItem(
        REDUX_STATE_LOCALSTORAGE_KEY,
        JSON.stringify(parsedState),
      )

    return parsedState.reduxState
  } catch (e) {
    return undefined
  }
}
