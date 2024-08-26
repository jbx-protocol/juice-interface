import { BigNumber } from 'ethers'

import { JBSplit as Split, SplitPortion, SPLITS_TOTAL_PERCENT } from 'juice-sdk-core'
import round from 'lodash/round'
import { fromWad, parseWad } from 'utils/format/formatNumber'
import { isInfinitePayoutLimit } from './fundingCycle'
import {
  MAX_PAYOUT_LIMIT,
} from './math'
import { splitPortionFromFormattedPercent } from './v4Splits'

export const JB_FEE = 0.025

/**
 * Derive payout amount after the fee has been applied.
 * @param amount - Amount before fee applied
 * @returns Amount @amount minus the JB fee
 */
export function deriveAmountAfterFee(amount: number) {
  return amount - amount * JB_FEE
}

/**
 * Derive payout amount before the fee has been applied.
 * @param amount - An amount that has already had the fee applied
 * @returns Amount @amount plus the JB fee
 */
export function deriveAmountBeforeFee(amount: number) {
  return amount / (1 - JB_FEE)
}

/**
 * Derive payout amount from its % of the distributionLimit. Apply fee if necessary
 * @param split - Payout split
 * @param distributionLimit - Distribution limit
 * @returns Amount that payout will receive as a number.
 */
export function derivePayoutAmount({
  payoutSplit,
  distributionLimit,
  dontApplyFee,
}: {
  payoutSplit: Split
  distributionLimit: number | undefined
  dontApplyFee?: boolean
}) {
  if (!distributionLimit) return 0
  const amountBeforeFee =
    payoutSplit.percent.toFloat() * distributionLimit
  if (isJuiceboxProjectSplit(payoutSplit) || dontApplyFee) return amountBeforeFee // projects dont have fee applied
  return deriveAmountAfterFee(amountBeforeFee)
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
  return (percent / 100) * parseFloat(amount)
}

/**
 * Gets split percent from split amount and the distribution limit
 * @param amount {float} - value as a percentage.
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
  return Number(splitPortionFromFormattedPercent((amount / distributionLimit) * 100))
}

/**
 * Calculates sum of all split percentages
 * @param splits {Split[]} - list of splits
 * @returns {number} sum of all split percentanges
 */
export function getTotalSplitsPercentage(splits: Split[]) {
  return splits.reduce(
    (acc, curr) => acc + curr.percent.formatPercentage(),
    0,
  )
}

/**
 * Due to limitations of rounding errors, it's possible that adjustedSplitPercents causes
 * the splits to sum to 99.99999999% or 100.0000001% (causes error) instead of 100%.
 * This function does one final pass of the percents to ensure they sum to 100%.
 * @param splits {Split[]} - list of current splits to possibly have their percents adjusted
 * @returns {Split[]} splits with their percents adjusted
 */
export function ensureSplitsSumTo100Percent({
  splits,
}: {
  splits: Split[]
}): Split[] {
  // Calculate the percent total of the splits
  const currentTotal = splits.reduce((sum, split) => sum + split.percent.value, 0n)
  const max = BigInt(SPLITS_TOTAL_PERCENT)
  // If the current total is already equal to SPLITS_TOTAL_PERCENT, no adjustment needed
  if (currentTotal === max) {
    return splits
  }

  // Calculate the ratio to adjust each split by
  const ratio = max / currentTotal

  // Adjust each split
  const adjustedSplits = splits.map(split => { 
    split.percent = new SplitPortion(Math.round(split.percent.toFloat() * Number(ratio)))
    return split
  
  })
  
  // Calculate the total after adjustment
  const adjustedTotal = adjustedSplits.reduce(
    (sum, split) => sum + split.percent.toFloat(),
    0,
  )
  if (adjustedTotal === SPLITS_TOTAL_PERCENT) {
    return adjustedSplits
  }
  // If there's STILL a difference due to rounding errors, adjust the largest split
  const difference = SPLITS_TOTAL_PERCENT - adjustedTotal
  const largestSplitIndex = adjustedSplits.findIndex(
    split => split.percent.toFloat() === Math.max(...adjustedSplits.map(s => s.percent.toFloat())),
  )
  if (adjustedSplits[largestSplitIndex]) {
    adjustedSplits[largestSplitIndex].percent = new SplitPortion(round(adjustedSplits[largestSplitIndex].percent.toFloat()) + difference)
  }
  return adjustedSplits
}

/**
 * Adjusts exist split percents to stay the same amount when distribution limit is changed
 * @param splits {Split[]} - list of current splits to have their percents adjusted
 * @param oldDistributionLimit {string} - string of the old distribution limit number (e.g. '1')
 * @param newDistributionLimit {string} - string of the new distribution limit number
 * @returns {Split[]} splits with their percents adjusted
 */
export function adjustedSplitPercents({
  splits,
  oldDistributionLimit,
  newDistributionLimit,
}: {
  splits: Split[]
  oldDistributionLimit: string
  newDistributionLimit: string
}) {
  const adjustedSplits: Split[] = []
  splits.forEach((split: Split) => {
    const currentAmount = amountFromPercent({
      percent: split.percent.formatPercentage(),
      amount: oldDistributionLimit,
    })
    const newPercent = getDistributionPercentFromAmount({
      amount: currentAmount,
      distributionLimit: parseFloat(newDistributionLimit),
    })
    let newSplitPortion
    try {
      newSplitPortion = new SplitPortion(newPercent)
    } catch (e) {
      // Will be replaced by new/editing payout split
      newSplitPortion = new SplitPortion(0)
    }
    const adjustedSplit = {
      beneficiary: split.beneficiary,
      percent: newSplitPortion,
      preferAddToBalance: split.preferAddToBalance,
      lockedUntil: split.lockedUntil,
      projectId: split.projectId,
      hook: split.hook,
    } as Split
    adjustedSplits?.push(adjustedSplit)
  })
  return adjustedSplits
}

/**
 * Derives the new distribution limit when a split amount is altered or added
 * @param editingSplitPercent {number} - percent of the split being edited (0 if adding a split)
 * @param newDistributionLimit {string} - string of the new distribution limit number (e.g. '1')
 * @returns {number} newDistributionLimit
 */
export function getNewDistributionLimit({
  editingSplitPercent,
  newSplitAmount,
  currentDistributionLimit,
  ownerRemainingAmount,
}: {
  editingSplitPercent: number // percent per billion
  newSplitAmount: number
  currentDistributionLimit: string
  ownerRemainingAmount?: number
}) {
  const previousSplitAmount =
    currentDistributionLimit === '0'
      ? 0
      : amountFromPercent({
          percent: new SplitPortion(editingSplitPercent).formatPercentage(),
          amount: currentDistributionLimit,
        }) // will be 0 when adding split but an actual amount when reconfiging or deleting

  return (
    parseFloat(currentDistributionLimit) -
    previousSplitAmount +
    newSplitAmount -
    (ownerRemainingAmount ?? 0)
  )
}

// Determines if a split is a Juicebox project
export function isJuiceboxProjectSplit(split: Split) {
  return split.projectId ? BigNumber.from(split.projectId).gt(0) : false
}

/**
 * Converts the distribution limit that comes from redux from string to a number. If infinite, returns undefined.
 * @param distributionLimit {string | undefined} - The distribution limit as a string (or undefined).
 * @returns {number | undefined} - Returns the distribution limit as a number if it isn't infinite, otherwise returns undefined.
 */
export function distributionLimitStringtoNumber(
  distributionLimit: string | undefined,
) {
  if (distributionLimit === undefined) return undefined
  const distributionLimitBN = parseWad(distributionLimit)
  const distributionLimitIsInfinite =
    !distributionLimitBN || distributionLimitBN.eq(MAX_PAYOUT_LIMIT)
  return distributionLimitIsInfinite
    ? undefined
    : parseFloat(fromWad(distributionLimitBN))
}

/**
 * Determines if two distributionLimits are the same
 * @param distributionLimit1 {BigNumber | undefined} - First DL to compare (undefined === unlimited)
 * @param distributionLimit2 {BigNumber | undefined} - Second DL to compare (undefined === unlimited)

 * @returns {boolean} - True if DLs are the same, 
 */
export function distributionLimitsEqual(
  distributionLimit1: bigint | undefined,
  distributionLimit2: bigint | undefined,
) {
  if (
    isInfinitePayoutLimit(distributionLimit1) &&
    isInfinitePayoutLimit(distributionLimit2)
  ) {
    return true
  }
  return distributionLimit1 === distributionLimit2
}
