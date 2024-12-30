import hash from 'object-hash'
import { DEFAULT_REDUX_STATE } from './v2ProjectDefaultState'

export const REDUX_STORE_V2_PROJECT_VERSION = hash(DEFAULT_REDUX_STATE)
