import * as constants from '@ethersproject/constants'
import { ONE_BILLION } from 'constants/numbers'

export const MAX_PAYOUT_LIMIT = constants.MaxUint256.toBigInt()
export const V4_SPLITS_TOTAL_PERCENT = BigInt(ONE_BILLION)
