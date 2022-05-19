import { BigNumber } from '@ethersproject/bignumber'
import { Split } from 'models/v2/splits'

import { formatSplitPercent, splitPercentFrom } from './math'

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
 * @param distributionLimit number
 * @returns {number} percent as an actual percentage of distribution limit (/100)
 */
export function getDistributionPercentFromAmount({
  amount, // Distribution amount before fee
  distributionLimit,
}: {
  amount: number
  distributionLimit: number
}) {
  // return parseFloat(((amount / distributionLimit) * 100).toFixed(9))
  return splitPercentFrom((amount / distributionLimit) * 100).toNumber()
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
  distributionLimit: number
}) {
  // if (distributionLimit.eq(MAX_DISTRIBUTION_LIMIT)) return 0

  // const distributionLimitNumber = distributionLimit.toNumber()

  return (distributionLimit * getTotalSplitsPercentage(splits)) / 100
}

export function adjustedSplitPercents({
  splits,
  oldDistributionLimit,
  newDistributionLimit,
}: {
  splits: Split[]
  oldDistributionLimit: string
  newDistributionLimit: string
}) {
  let adjustedSplits: Split[] = []
  splits.forEach((split: Split) => {
    const currentAmount = amountFromPercent({
      percent: parseFloat(formatSplitPercent(BigNumber.from(split.percent))),
      amount: oldDistributionLimit,
    })

    const newPercent = getDistributionPercentFromAmount({
      amount: currentAmount,
      distributionLimit: parseFloat(newDistributionLimit),
    })
    const adjustedSplit = {
      beneficiary: split.beneficiary,
      percent: newPercent,
      preferClaimed: split.preferClaimed,
      lockedUntil: split.lockedUntil,
      projectId: split.projectId,
      allocator: split.allocator,
    } as Split
    adjustedSplits?.push(adjustedSplit)
  })
  return adjustedSplits
}

export function getNewDistributionLimit({
  splits,
  editingSplitPercent,
  newSplitAmount,
  currentDistributionLimit,
}: {
  splits: Split[]
  editingSplitPercent: number // percent per billion
  newSplitAmount: number
  currentDistributionLimit: string
}) {
  const sumOfCurrentSplitAmounts = sumOfPayoutSplitAmounts({
    splits,
    distributionLimit: parseFloat(currentDistributionLimit),
  })

  const previousSplitAmount = amountFromPercent({
    percent: parseFloat(
      formatSplitPercent(BigNumber.from(editingSplitPercent)),
    ),
    amount: currentDistributionLimit,
  }) // will be 0 when adding split but an actual amount when reconfiging or deleting

  const newDistributionLimit =
    sumOfCurrentSplitAmounts - previousSplitAmount + newSplitAmount
  return newDistributionLimit
}
