import { BigNumber } from '@ethersproject/bignumber'
import { Split } from 'models/v2/splits'

import { formatSplitPercent, MAX_DISTRIBUTION_LIMIT } from './math'

/**
 * Gets distribution amount from percent of the distribution limit and then applies
 * the protocol fee
 * @param percent {float} - value as a percentage.
 * @param distributionLimit string (BigNumber as string)
 * @param feePercentage string (BigNumber as string)
 * @returns {number} distribution amount
 */
export function getDistributionAmountFromPercentAfterFee({
  percent,
  distributionLimit,
  feePercentage,
}: {
  percent: number
  distributionLimit: string | undefined
  feePercentage: string
}) {
  const amountBeforeFee = getDistributionAmountFromPercentBeforeFee({
    percent,
    distributionLimit,
  })

  if (!amountBeforeFee) return

  return parseFloat(
    (
      amountBeforeFee -
      (amountBeforeFee * parseFloat(feePercentage)) / 100
    ).toFixed(4),
  )
}

/**
 * Gets distribution amount from percent of the distribution limit and does not apply
 * any fee
 * @param percent {float} - value as a percentage.
 * @param distributionLimit string (BigNumber as string)
 * @returns {number} distribution amount
 */
export function getDistributionAmountFromPercentBeforeFee({
  percent,
  distributionLimit,
}: {
  percent: number
  distributionLimit: string | undefined
}) {
  if (
    !distributionLimit ||
    BigNumber.from(distributionLimit).eq(MAX_DISTRIBUTION_LIMIT)
  )
    return

  return parseFloat(
    ((percent / 100) * parseFloat(distributionLimit)).toFixed(8),
  )
}

/**
 * Gets split percent from split amount and the distribution limit
 * @param percent {float} - value as a percentage.
 * @param distributionLimit string (BigNumber as string)
 * @returns {number} percent as an actual percentage of distribution limit (/100)
 */
export function getDistributionPercentFromAmount({
  amount, // Distribution amount before fee
  distributionLimit,
}: {
  amount: number
  distributionLimit: string | undefined
}) {
  if (
    !distributionLimit ||
    BigNumber.from(distributionLimit).eq(MAX_DISTRIBUTION_LIMIT)
  )
    return

  return (amount / parseFloat(distributionLimit)) * 100
}

/**
 * Calculates sum of all split percentages
 * @param splits {Split[]} - list of splits
 * @returns {number} sum of all split percentanges
 */
export function getTotalSplitsPercentage(splits: Split[]) {
  return splits.reduce(
    (acc, curr) =>
      acc + parseFloat(formatSplitPercent(BigNumber.from(curr.percent))),
    0,
  )
}
