import {
  MaxUint232,
  MaxUint88,
  ONE_BILLION,
  TEN_THOUSAND,
} from 'constants/numbers'
import { ethers } from 'ethers'

import round from 'lodash/round'
import { JBFee } from 'models/v2v3/fee'
import {
  V2V3FundingCycleData,
  V2V3FundingCycleMetadata,
} from 'models/v2v3/fundingCycle'
import { invertPermyriad } from 'utils/bigNumbers'
import {
  formattedNum,
  fromWad,
  percentToPermyriad,
} from 'utils/format/formatNumber'
import { WeightFunction } from 'utils/math'

export const MAX_RESERVED_RATE = TEN_THOUSAND
export const MAX_REDEMPTION_RATE = TEN_THOUSAND
export const MAX_DISCOUNT_RATE = ONE_BILLION
export const SPLITS_TOTAL_PERCENT = ONE_BILLION
export const MAX_DISTRIBUTION_LIMIT = MaxUint232

export const MAX_MINT_RATE = Math.floor(MaxUint88 / 10 ** 18)

const MAX_FEE = ONE_BILLION

type IssueeType = 'reserved' | 'payer'

/**
 * Express a given discount rate (parts-per-billion) as a percentage.
 * @param discountRate - discount rate as parts-per-billion.
 * @returns {string} discount rate expressed as a percentage.
 */
export const formatDiscountRate = (discountRate: bigint | string): string => {
  return (
    Number((BigInt(discountRate) * 100n) / (MAX_DISCOUNT_RATE / 100n)) / 100
  ).toString()
}

/**
 * Express a given percentage as a discount rate (parts-per-billion).
 * @param percentage - value as a percentage.
 * @returns {bigint} percentage expressed as parts-per-billion.
 */
export const discountRateFrom = (percentage: string | number): bigint => {
  const percentageAsNumber = Number(percentage)
  return BigInt(
    Math.floor(Number(percentageAsNumber * Number(MAX_DISCOUNT_RATE))) / 100,
  )
}

/**
 * Express a given split "percent" (parts-per-billion) as a percentage.
 * NOTE: splitPercent is named misleadingly. splitPercent is not a percentage (x/100)
 * It is express as parts-per-billion.
 * @param splitPercent - split "percent" as parts-per-billion.
 * @returns {string} split expressed as a percentage.
 */
export const formatSplitPercent = (splitPercent: bigint): string => {
  return (
    Number((splitPercent * 100n) / (SPLITS_TOTAL_PERCENT / 100n)) / 100
  ).toString()
}

/**
 * Express a given split "percent" (parts-per-billion) as a percentage to the maximum precision.
 * @param splitPercent - split "percent" as parts-per-billion.
 * @returns {number} percentage (/100)
 */
export const preciseFormatSplitPercent = (
  percentPerBillion: number,
): number => {
  return (percentPerBillion / Number(SPLITS_TOTAL_PERCENT)) * 100
}

/**
 * Express a given [percentage] as a split "percent" (parts-per-billion).
 * NOTE: splitPercent is named misleadingly. splitPercent is not a percentage (x/100)
 * It is express as parts-per-billion.
 * @param percentage {float} - value as a percentage.
 * @returns {bigint} percentage expressed as parts-per-billion.
 */
export const splitPercentFrom = (percentage: number): bigint => {
  return percentage
    ? BigInt(round((percentage * Number(SPLITS_TOTAL_PERCENT)) / 100))
    : BigInt(0)
}

/**
 * Express a given reserved rate (parts-per-ten thousand) as a percentage.
 * @param reservedRate - reserved rate as parts-per-thousand.
 * @returns {string} reserved rate expressed as a percentage.
 */
export const formatReservedRate = (
  reservedRate: bigint | string | undefined,
): string => {
  return reservedRate
    ? (
        Number((BigInt(reservedRate) * 100n) / (MAX_RESERVED_RATE / 100n)) / 100
      ).toString()
    : '0'
}

/**
 * Express a given [percentage] as a reserved rate (parts-per-ten thousand).
 * @param percentage - value as a percentage.
 * @returns {bigint} percentage expressed as parts-per-thousand.
 */
export const reservedRateFrom = (percentage: string | number): bigint => {
  const percentageAsNumber = Number(percentage)
  return BigInt(
    Math.floor((percentageAsNumber * Number(MAX_RESERVED_RATE)) / 100),
  )
}

/**
 * Express a given redemption rate (parts-per-ten thousand) as a percentage.
 * @param redemptionRate - redemption rate as parts-per-thousand.
 * @returns {string} redemption rate expressed as a percentage.
 */
export const formatRedemptionRate = (
  redemptionRate: bigint | string,
): string => {
  return (
    Number((BigInt(redemptionRate) * 100n) / (MAX_REDEMPTION_RATE / 100n)) / 100
  ).toString()
}

/**
 * Express a given [percentage] as a redemption rate (parts-per-ten thousand).
 * @param percentage - value as a percentage.
 * @returns {bigint} percentage expressed as parts-per-thousand.
 */
export const redemptionRateFrom = (percentage: string | number): bigint => {
  const percentageAsNumber = Number(percentage)
  return BigInt(
    Math.floor((percentageAsNumber * Number(MAX_REDEMPTION_RATE)) / 100),
  )
}

/**
 * Express a given issuance rate [tokens / 1 ETH] as an issuance rate in parts per 1e18
 * @param issuanceRate - issuance rate as tokens / ETH
 * @returns {string} issuance rate in parts per 1e18
 */
export const issuanceRateFrom = (issuanceRate: string): string => {
  return (
    ethers.WeiPerEther * BigInt(Math.floor(parseFloat(issuanceRate)))
  ).toString()
}

/**
 * Express a given issuance rate in parts per 1e18 as an issuance rate [tokens / 1 ETH]
 * @param {bigint} issuanceRate issuance rate in parts per 1e18
 * @returns {string} issuance rate in tokens / 1ETH
 */
export const formatIssuanceRate = (issuanceRate: string): string => {
  // Round down to nearest wei
  if (issuanceRate.split('.').length) {
    issuanceRate = issuanceRate.split('.')[0]
  }
  return (BigInt(issuanceRate) / ethers.WeiPerEther).toString()
}

/**
 * Express a given fee (parts-per-billion) as a percentage.
 * @param feePerBillion - fee as parts-per-billion.
 * @returns {string} fee expressed as a percentage.
 */
export const formatFee = (feePerBillion: bigint): string => {
  return (
    Number((feePerBillion * ONE_BILLION * 100n) / MAX_FEE) / Number(ONE_BILLION)
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
export const weightAmountPermyriad: WeightFunction = (
  weight: bigint | undefined,
  reservedRatePermyriad: number | undefined,
  amountWad: bigint | undefined,
  outputType: IssueeType,
): string => {
  if (!weight || !amountWad) return '0'

  if (reservedRatePermyriad === undefined) return '0'

  const value =
    (amountWad *
      weight *
      (outputType === 'reserved'
        ? BigInt(reservedRatePermyriad)
        : invertPermyriad(BigInt(reservedRatePermyriad)))) /
    percentToPermyriad(100)
  return fromWad(value) ?? '0'
}

export const feeForAmount = (
  amountWad: bigint | undefined,
  feePerBillion: bigint | undefined,
): bigint | undefined => {
  if (!feePerBillion || !amountWad) return
  return (amountWad * feePerBillion) / ONE_BILLION
}

export const amountSubFee = (
  amountWad: bigint | undefined,
  feePerBillion: bigint | undefined,
): bigint | undefined => {
  if (!feePerBillion || !amountWad) return
  const feeAmount = feeForAmount(amountWad, feePerBillion) ?? 0n
  return amountWad - feeAmount
}

// `heldFeesOf` returns list of JBFee
// We derive each fee amount by multiplying the distributed amount by the fee,
// and return the sum of them all
export function sumHeldFees(fees: JBFee[]) {
  return fees.reduce((sum, heldFee) => {
    const amountWad = feeForAmount(heldFee.amount, BigInt(heldFee.fee))
    const amountNum = parseFloat(fromWad(amountWad))
    return sum + (amountNum ?? 0)
  }, 0)
}

export function computeIssuanceRate(
  fundingCycle: V2V3FundingCycleData,
  fundingCycleMetadata: V2V3FundingCycleMetadata,
  issuee: IssueeType,
  formatted = true,
) {
  const computed = formatIssuanceRate(
    weightAmountPermyriad(
      fundingCycle.weight,
      Number(fundingCycleMetadata.reservedRate ?? 0),
      ethers.parseEther('1'),
      issuee,
    ) ?? '',
  )
  return formatted ? formattedNum(computed)! : computed
}
