import * as constants from '@ethersproject/constants'
import { ONE_BILLION } from 'constants/numbers'

export const MAX_PAYOUT_LIMIT = constants.MaxUint256.toBigInt()
export const V4_SPLITS_TOTAL_PERCENT = BigInt(ONE_BILLION)


/**
 * Express a given split "percent" (parts-per-billion) as a percentage.
 * NOTE: splitPercent is named misleadingly. splitPercent is not a percentage (x/100)
 * It is express as parts-per-billion.
 * @param splitPercent - split "percent" as parts-per-billion.
 * @returns {string} split expressed as a percentage.
 */
export const formatV4SplitPercent = (splitPercent: bigint): string => {
  return (
    (splitPercent
      * 100n
      / (V4_SPLITS_TOTAL_PERCENT / 100n))
      / 100n
  ).toString()
}
