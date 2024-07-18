import * as constants from '@ethersproject/constants'
import { V4Split } from "../models/v4Split"
import { V4_SPLITS_TOTAL_PERCENT } from "./math"

/**
 * Return a Split object that represents the remaining percentage allocated to the project owner.
 *
 * In the Juicebox protocol, if the sum of the split percentages is less than 100%,
 * the remainder gets allocated to the project owner.
 */
export const v4GetProjectOwnerRemainderSplit = (
  projectOwnerAddress: `0x${string}`,
  splits: V4Split[],
): V4Split & { isProjectOwner: true } => {
  const totalSplitPercentage = v4TotalSplitsPercent(splits)
  const ownerPercentage = V4_SPLITS_TOTAL_PERCENT - totalSplitPercentage

  return {
    beneficiary: projectOwnerAddress,
    percent: ownerPercentage,
    lockedUntil: 0n,
    projectId: 0n,
    isProjectOwner: true,
    preferAddToBalance: false,
    hook: constants.AddressZero,
  }
}

/**
 * Returns the sum of each split's percent in a list of splits
 * @param splits {Split[]} - list of splits to sum percents
 * @returns {bigint} - sum of percents in part-per-billion (max = V4_SPLITS_TOTAL_PERCENT)
 */
export const v4TotalSplitsPercent = (splits: V4Split[]): bigint =>
  splits?.reduce((sum, split) => sum + split.percent, 0n) ?? 0n
