import { BigNumber } from 'ethers'

export type WeightFunction = (
  weight: BigNumber | undefined,
  reservedRate: number | undefined,
  wadAmount: BigNumber | undefined,
  outputType: 'payer' | 'reserved',
) => string

// Determines if a string value contains only digits
export const stringIsDigit = (value: string) => {
  return /^\d+$/.test(value)
}

/**
 * Rounds up a number to the nearest integer if it is very close to the next highest integer.
 * The closeness is determined by a precision parameter.
 * @param {number} num - The number to round up.
 * @param {number} precision - The minimum difference between the original number and its ceiling to trigger rounding up.
 * @returns {number} The original number rounded up to the nearest integer or the original number if it does not meet the precision criteria.
 * @example
 * // Rounds up 99.99999999999999 to 100 with the default precision of 0.01
 * ceilIfCloseToNextInteger(99.99999999999999); // 100
 * // Does not round up 99.990 with the default precision of 0.01
 * ceilIfCloseToNextInteger(99.990); // 99.99
 * // Rounds up 50.003 to 51 with a precision of 0.005
 * ceilIfCloseToNextInteger(50.003, 0.005); // 51
 */
export const ceilIfCloseToNextInteger = (
  num: number,
  precision = 0.01,
): number => {
  if (Math.abs(num - Math.ceil(num)) < precision) {
    return Math.ceil(num)
  }
  return num
}

export const roundIfCloseToNextInteger = (
  num: number,
  precision = 0.01,
): number => {
  if (Math.abs(num - Math.round(num)) < precision) {
    return Math.round(num)
  }
  return num
}
