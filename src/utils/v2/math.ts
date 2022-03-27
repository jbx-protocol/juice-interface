import { BigNumber } from '@ethersproject/bignumber'

const TEN_THOUSAND = 10000
const ONE_BILLION = 1000000000

export const MAX_RESERVED_RATE = TEN_THOUSAND
export const MAX_REDEMPTION_RATE = TEN_THOUSAND
export const MAX_DISCOUNT_RATE = ONE_BILLION
export const SPLITS_TOTAL_PERCENT = ONE_BILLION

/**
 * Express a given discount rate (parts-per-billion) as a percentage.
 * @param discountRate - discount rate as parts-per-billion.
 * @returns {string} discount rate expressed as a percentage.
 */
export const formatDiscountRate = (discountRate: BigNumber) => {
  return discountRate.div(MAX_DISCOUNT_RATE / 100).toString()
}

/**
 * Express a given percentage as a discount rate (parts-per-billion).
 * @param percentage - value as a percentage.
 * @returns {BigNumber} percentage expressed as parts-per-billion.
 */
export const discountRateFrom = (percentage: string) => {
  return BigNumber.from(percentage).mul(MAX_DISCOUNT_RATE / 100)
}

/**
 * Express a given split "percent" (parts-per-billion) as a percentage.
 * NOTE: splitPercent is named misleadingly. splitPercent is not a percentage (x/100)
 * It is express as parts-per-billion.
 * @param splitPercent - split "percent" as parts-per-billion.
 * @returns {string} split expressed as a percentage.
 */
export const formatSplitPercent = (splitPercent: BigNumber) => {
  return splitPercent.div(SPLITS_TOTAL_PERCENT / 100).toString()
}

/**
 * Express a given [percentage] as a split "percent" (parts-per-billion).
 * NOTE: splitPercent is named misleadingly. splitPercent is not a percentage (x/100)
 * It is express as parts-per-billion.
 * @param percentage - value as a percentage.
 * @returns {BigNumber} percentage expressed as parts-per-billion.
 */
export const splitPercentFrom = (percentage: number) => {
  return percentage
    ? BigNumber.from((percentage * SPLITS_TOTAL_PERCENT) / 100)
    : BigNumber.from(0)
}

/**
 * Express a given reserved rate (parts-per-ten thousand) as a percentage.
 * @param reservedRate - reserved rate as parts-per-thousand.
 * @returns {string} reserved rate expressed as a percentage.
 */
export const formatReservedRate = (reservedRate: BigNumber | undefined) => {
  return reservedRate
    ? BigNumber.from(reservedRate)
        .div(MAX_RESERVED_RATE / 100)
        .toString()
    : '0'
}

/**
 * Express a given [percentage] as a reserved rate (parts-per-ten thousand).
 * @param percentage - value as a percentage.
 * @returns {BigNumber} percentage expressed as parts-per-thousand.
 */
export const reservedRateFrom = (percentage: string) => {
  return BigNumber.from(percentage).mul(MAX_RESERVED_RATE / 100)
}

/**
 * Express a given redemption rate (parts-per-ten thousand) as a percentage.
 * @param redemptionRate - redemption rate as parts-per-thousand.
 * @returns {string} redemption rate expressed as a percentage.
 */
export const formatRedemptionRate = (redemptionRate: BigNumber) => {
  return redemptionRate.div(MAX_REDEMPTION_RATE / 100).toString()
}

/**
 * Express a given [percentage] as a redemption rate (parts-per-ten thousand).
 * @param percentage - value as a percentage.
 * @returns {BigNumber} percentage expressed as parts-per-thousand.
 */
export const redemptionRateFrom = (percentage: string) => {
  return BigNumber.from(percentage).mul(MAX_REDEMPTION_RATE / 100)
}
