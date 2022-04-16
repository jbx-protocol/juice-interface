import { BigNumber } from '@ethersproject/bignumber'
import * as constants from '@ethersproject/constants'
import { invertPermyriad } from 'utils/bigNumbers'
import { fromWad, percentToPermyriad } from 'utils/formatNumber'
import { WeightFunction } from 'utils/math'

const TEN_THOUSAND = 10000
const ONE_BILLION = 1000000000

export const MAX_RESERVED_RATE = TEN_THOUSAND
export const MAX_REDEMPTION_RATE = TEN_THOUSAND
export const MAX_DISCOUNT_RATE = ONE_BILLION
export const SPLITS_TOTAL_PERCENT = ONE_BILLION
export const MAX_FEE = ONE_BILLION
export const MAX_DISTRIBUTION_LIMIT = constants.MaxUint256

/**
 * Express a given discount rate (parts-per-billion) as a percentage.
 * @param discountRate - discount rate as parts-per-billion.
 * @returns {string} discount rate expressed as a percentage.
 */
export const formatDiscountRate = (discountRate: BigNumber): string => {
  return (
    discountRate
      .mul(100)
      .div(MAX_DISCOUNT_RATE / 100)
      .toNumber() / 100
  ).toString()
}

/**
 * Express a given percentage as a discount rate (parts-per-billion).
 * @param percentage - value as a percentage.
 * @returns {BigNumber} percentage expressed as parts-per-billion.
 */
export const discountRateFrom = (percentage: string): BigNumber => {
  return BigNumber.from(
    Math.floor((parseFloat(percentage) * MAX_DISCOUNT_RATE) / 100),
  )
}

/**
 * Express a given split "percent" (parts-per-billion) as a percentage.
 * NOTE: splitPercent is named misleadingly. splitPercent is not a percentage (x/100)
 * It is express as parts-per-billion.
 * @param splitPercent - split "percent" as parts-per-billion.
 * @returns {string} split expressed as a percentage.
 */
export const formatSplitPercent = (splitPercent: BigNumber): string => {
  return (
    splitPercent
      .mul(100)
      .div(SPLITS_TOTAL_PERCENT / 100)
      .toNumber() / 100
  ).toString()
}

/**
 * Express a given [percentage] as a split "percent" (parts-per-billion).
 * NOTE: splitPercent is named misleadingly. splitPercent is not a percentage (x/100)
 * It is express as parts-per-billion.
 * @param percentage {float} - value as a percentage.
 * @returns {BigNumber} percentage expressed as parts-per-billion.
 */
export const splitPercentFrom = (percentage: number): BigNumber => {
  return percentage
    ? BigNumber.from((percentage * SPLITS_TOTAL_PERCENT) / 100)
    : BigNumber.from(0)
}

/**
 * Express a given reserved rate (parts-per-ten thousand) as a percentage.
 * @param reservedRate - reserved rate as parts-per-thousand.
 * @returns {string} reserved rate expressed as a percentage.
 */
export const formatReservedRate = (
  reservedRate: BigNumber | undefined,
): string => {
  return reservedRate
    ? (
        reservedRate
          .mul(100)
          .div(MAX_RESERVED_RATE / 100)
          .toNumber() / 100
      ).toString()
    : '0'
}

/**
 * Express a given [percentage] as a reserved rate (parts-per-ten thousand).
 * @param percentage - value as a percentage.
 * @returns {BigNumber} percentage expressed as parts-per-thousand.
 */
export const reservedRateFrom = (percentage: string): BigNumber => {
  return BigNumber.from(
    Math.floor((parseFloat(percentage) * MAX_RESERVED_RATE) / 100),
  )
}

/**
 * Express a given redemption rate (parts-per-ten thousand) as a percentage.
 * @param redemptionRate - redemption rate as parts-per-thousand.
 * @returns {string} redemption rate expressed as a percentage.
 */
export const formatRedemptionRate = (redemptionRate: BigNumber): string => {
  return (
    redemptionRate
      .mul(100)
      .div(MAX_REDEMPTION_RATE / 100)
      .toNumber() / 100
  ).toString()
}

/**
 * Express a given [percentage] as a redemption rate (parts-per-ten thousand).
 * @param percentage - value as a percentage.
 * @returns {BigNumber} percentage expressed as parts-per-thousand.
 */
export const redemptionRateFrom = (percentage: string): BigNumber => {
  return BigNumber.from(
    Math.floor((parseFloat(percentage) * MAX_REDEMPTION_RATE) / 100),
  )
}

/**
 * Express a given fee (parts-per-billion) as a percentage.
 * @param feePerBillion - fee as parts-per-billion.
 * @returns {string} fee expressed as a percentage.
 */
export const formatFee = (feePerBillion: BigNumber): string => {
  return (
    feePerBillion
      .mul(ONE_BILLION * 100)
      .div(MAX_FEE)
      .toNumber() / ONE_BILLION
  ).toString()
}

/**
 * Return a given [amountWad] weighted by a given [weight] and [reservedRatePermyriad].
 *
 * Typically only used by Juicebox V2 projects.
 *
 * @param weight - scalar value for weighting. Typically funding cycle weight.
 * @param reservedRatePermyriad - reserve rate, as a permyriad (x/10,000)
 * @param amountWad - amount to weight, as a wad.
 * @param outputType
 * @returns
 */
export const weightedAmount: WeightFunction = (
  weight: BigNumber | undefined,
  reservedRatePermyriad: number | undefined,
  amountWad: BigNumber | undefined,
  outputType: 'payer' | 'reserved',
): string | undefined => {
  if (!weight || !amountWad) return

  if (reservedRatePermyriad === undefined) return

  return fromWad(
    amountWad
      .mul(weight)
      .mul(
        outputType === 'reserved'
          ? reservedRatePermyriad
          : invertPermyriad(BigNumber.from(reservedRatePermyriad)),
      )
      .div(percentToPermyriad(100)),
  )
}

export const feeForAmount = (
  amountWad: BigNumber | undefined,
  feePerBillion: BigNumber | undefined,
): BigNumber | undefined => {
  if (!feePerBillion || !amountWad) return
  return amountWad.mul(feePerBillion).div(ONE_BILLION)
}

export const amountSubFee = (
  amountWad?: BigNumber,
  feePerBillion?: BigNumber,
): BigNumber | undefined => {
  if (!feePerBillion || !amountWad) return
  const feeAmount = feeForAmount(amountWad, feePerBillion) ?? 0
  return amountWad.sub(feeAmount)
}

/**
 * new amount = old amount / (1 - fee)
 */
export const amountAddFee = (
  amountWad?: string,
  feePerBillion?: BigNumber,
): string | undefined => {
  if (!feePerBillion || !amountWad) return

  const inverseFeePerbillion = BigNumber.from(ONE_BILLION).sub(feePerBillion)
  const amountPerbillion = BigNumber.from(amountWad).mul(ONE_BILLION)
  // new amount is in regular decimal units
  const newAmount = amountPerbillion.div(inverseFeePerbillion)

  return newAmount.toString()
}
