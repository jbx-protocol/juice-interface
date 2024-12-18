import { DEFAULT_REDUX_STATE } from './v2ProjectDefaultState'
import { REDUX_STORE_V2_PROJECT_VERSION } from './v2ProjectVersion'

export const INITIAL_REDUX_STATE = {
  version: REDUX_STORE_V2_PROJECT_VERSION,
  ...DEFAULT_REDUX_STATE,
}
