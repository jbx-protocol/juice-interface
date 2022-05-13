import { BigNumber } from '@ethersproject/bignumber'
import { Split } from 'models/v2/splits'

import { formatSplitPercent, MAX_DISTRIBUTION_LIMIT } from './math'

/**
 * Gets distribution amount from percent of the distribution limit and then applies
 * the protocol fee
 * @param percent {float} - value as a percentage.
 * @param distributionLimit string (hexString)
 * @param feePercentage string (hexString)
 * @returns {number} distribution amount
 */
export function getDistributionAmountFromPercentAfterFee({
  percent,
  distributionLimit,
  feePercentage,
}: {
  percent: number
  distributionLimit: string
  feePercentage: string
}) {
  const amountBeforeFee = amountFromPercent({
    percent,
    amount: distributionLimit,
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
 * Gets amount from percent of a bigger amount
 * @param percent {float} - value as a percentage.
 * @param amount string (hexString)
 * @returns {number} distribution amount
 */
export function amountFromPercent({
  percent,
  amount,
}: {
  percent: number
  amount: string
}) {
  return parseFloat(((percent / 100) * parseFloat(amount)).toFixed(8))
}

/**
 * Gets split percent from split amount and the distribution limit
 * @param percent {float} - value as a percentage.
 * @param distributionLimit string (hexString)
 * @returns {number} percent as an actual percentage of distribution limit (/100)
 */
export function getDistributionPercentFromAmount({
  amount, // Distribution amount before fee
  distributionLimit,
}: {
  amount: number
  distributionLimit: string
}) {
  return parseInt(((amount / parseFloat(distributionLimit)) * 100).toFixed(16))
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

/**
 * Calculates sum of all split amounts based on current distribution limit
 * @param splits {Split[]} - list of splits
 * @returns {number} sum of all split amounts
 */
export function sumOfPayoutSplitAmounts({
  splits,
  distributionLimit,
}: {
  splits: Split[]
  distributionLimit: BigNumber
}) {
  if (distributionLimit.eq(MAX_DISTRIBUTION_LIMIT)) return 0

  const distributionLimitNumber = distributionLimit.toNumber()

  return (distributionLimitNumber * getTotalSplitsPercentage(splits)) / 100
}
