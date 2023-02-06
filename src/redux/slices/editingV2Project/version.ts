import { DEFAULT_REDUX_STATE } from './defaultState'
import hash from 'object-hash'

export const REDUX_STORE_V2_PROJECT_VERSION = hash(DEFAULT_REDUX_STATE)
