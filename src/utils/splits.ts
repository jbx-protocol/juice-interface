import { ethers } from 'ethers'
import isEqual from 'lodash/isEqual'
import { Split, SplitParams } from 'models/splits'

import { toHexString } from './bigNumbers'
import { formatWad } from './format/formatNumber'
import { isFiniteDistributionLimit } from './v2v3/fundingCycle'
import { SPLITS_TOTAL_PERCENT } from './v2v3/math'

//  - true if the split has been removed (exists in old but not new),
//  - false if new (exists in new but not old)
//  - Split if exists in old and new and there is a diff in the splits
//  - undefined if exists in old and new and there is no diff in the splits
type OldSplit = Split | boolean | undefined

export type SplitWithDiff = Split & {
  oldSplit?: OldSplit
}

// determines if two splits are the same 'entity' (either projectId or address)
export const hasEqualRecipient = (a: Split, b: Split) => {
  const isProject = isProjectSplit(a) || isProjectSplit(b)
  const idsEqual =
    a.projectId === b.projectId ||
    BigInt(a.projectId ?? 0) === BigInt(b.projectId ?? 0) ||
    BigInt(b.projectId ?? 0) === BigInt(a.projectId ?? 0)

  return (
    (isProject && idsEqual) || (!isProject && a.beneficiary === b.beneficiary)
  )
}

// return list of splits that exist in oldSplits but not newSplits
const getRemovedSplits = (oldSplits: Split[], newSplits: Split[]) => {
  return oldSplits.filter(oldSplit => {
    return !newSplits.some(newSplit => hasEqualRecipient(oldSplit, newSplit))
  })
}

export const sanitizeSplit = (split: Split): Split => {
  return {
    lockedUntil: split.lockedUntil ?? 0,
    projectId: split.projectId ?? toHexString(0n),
    beneficiary: split.beneficiary ?? ethers.ZeroAddress,
    allocator: split.allocator ?? ethers.ZeroAddress,
    preferClaimed: false,
    percent: split.percent,
  }
}

/**
 * Return a Split object that represents the remaining percentage allocated to the project owner.
 *
 * In the Juicebox protocol, if the sum of the split percentages is less than 100%,
 * the remainder gets allocated to the project owner.
 */
export const getProjectOwnerRemainderSplit = (
  projectOwnerAddress: string,
  splits: Split[],
): Split & { isProjectOwner: true } => {
  const totalSplitPercentage = totalSplitsPercent(splits)
  const ownerPercentage = Number(SPLITS_TOTAL_PERCENT) - totalSplitPercentage

  return {
    beneficiary: projectOwnerAddress,
    percent: ownerPercentage,
    preferClaimed: false,
    lockedUntil: 0,
    projectId: toHexString(0n),
    allocator: ethers.ZeroAddress,
    isProjectOwner: true,
  }
}

/**
 * Converts array of splits from transaction data (e.g. outgoing reconfig tx) to array of native Split objects
 * (Outgoing Split objects have percent and lockedUntil as bigints)
 */
export const toSplit = (splits: SplitParams[]): Split[] => {
  return (
    splits?.map(
      (split: SplitParams) =>
        ({ ...split, percent: Number(split.percent) } as Split),
    ) ?? []
  )
}

// returns a given list of splits sorted by percent allocation
export const sortSplits = (splits: Split[]) => {
  return [...splits].sort((a, b) => (a.percent < b.percent ? 1 : -1))
}

/* Determines if two splits AMOUNTS are===ual. Extracts amounts for two splits from their respective totalValues **/
export function splitAmountsAreEqual({
  split1,
  split2,
  split1TotalValue,
  split2TotalValue,
}: {
  split1: Split
  split2: Split
  split1TotalValue?: bigint
  split2TotalValue?: bigint
}) {
  const split1Amount = formatWad(
    ((split1TotalValue ?? 0n) * BigInt(split1.percent)) / SPLITS_TOTAL_PERCENT,
    {
      precision: 2,
    },
  )
  const split2Amount = formatWad(
    ((split2TotalValue ?? 0n) * BigInt(split2.percent)) / SPLITS_TOTAL_PERCENT,
    {
      precision: 2,
    },
  )
  return split2Amount === split1Amount
}

/* Determines if two splits are===ual. If given totalValues, uses the amount of each split instead of its percent **/
function splitsAreEqual({
  split1,
  split2,
  split1TotalValue,
  split2TotalValue,
}: {
  split1: Split
  split2: Split
  split1TotalValue?: bigint
  split2TotalValue?: bigint
}) {
  const isFiniteTotalValue =
    isFiniteDistributionLimit(split1TotalValue) &&
    isFiniteDistributionLimit(split2TotalValue)
  if (!isFiniteTotalValue) {
    return isEqual(split1, split2)
  }
  return (
    splitAmountsAreEqual({
      split1,
      split2,
      split1TotalValue,
      split2TotalValue,
    }) &&
    split1.beneficiary === split2.beneficiary &&
    split1.allocator === split2.allocator &&
    split1.lockedUntil === split2.lockedUntil &&
    split1.projectId === split2.projectId &&
    split1.preferClaimed === split2.preferClaimed
  )
}

// returns all unique and diffed splits (projectIds or addresses), sorted by their new `percent`
// and assigns each split an additional property `oldSplit` (OldSplit)
export const processUniqueSplits = ({
  oldTotalValue,
  newTotalValue,
  oldSplits,
  newSplits,
  allSplitsChanged,
}: {
  oldTotalValue?: bigint
  newTotalValue?: bigint
  oldSplits: Split[] | undefined
  newSplits: Split[]
  allSplitsChanged?: boolean // pass when you know all splits have changed (e.g. currency has changed)
}): SplitWithDiff[] => {
  const uniqueSplitsByProjectIdOrAddress: Array<SplitWithDiff> = []
  if (!oldSplits) return sortSplits(newSplits)
  newSplits.map(split => {
    const oldSplit = oldSplits.find(oldSplit =>
      hasEqualRecipient(oldSplit, split),
    )
    const splitsEqual =
      oldSplit && !allSplitsChanged
        ? splitsAreEqual({
            split1: split,
            split2: oldSplit,
            split1TotalValue: newTotalValue,
            split2TotalValue: oldTotalValue,
          })
        : false

    if (oldSplit && !splitsEqual) {
      // adds diffed splits (exists in new and old and there is diff)
      uniqueSplitsByProjectIdOrAddress.push({
        ...split,
        oldSplit: {
          ...oldSplit,
          totalValue: oldTotalValue,
        },
      })
    } else if (oldSplit && splitsEqual) {
      // undiff'd split (exists in new and old and there is no diff) = DO NOTHING
      return
    } else {
      // adds the new splits (exists in new but not old)
      uniqueSplitsByProjectIdOrAddress.push({
        ...split,
        oldSplit: false,
      })
    }
  })
  // adds the old splits (exists in old but not new)
  const removedSplits = getRemovedSplits(oldSplits, newSplits)
  removedSplits.map(split => {
    uniqueSplitsByProjectIdOrAddress.push({
      ...split,
      oldSplit: true,
    })
  })
  return sortSplits(uniqueSplitsByProjectIdOrAddress)
}

export const isProjectSplit = (split: Split): boolean => {
  return Boolean(split.projectId) && BigInt(split.projectId ?? 0) > 0n
}

export const projectIdToHex = (projectIdString: string | undefined) =>
  toHexString(BigInt(projectIdString ?? 0))

/**
 * Returns the sum of each split's percent in a list of splits
 * @param splits {Split[]} - list of splits to sum percents
 * @returns {number} - sum of percents in part-per-billion (max = SPLITS_TOTAL_PERCENT)
 */
export const totalSplitsPercent = (splits: Split[]): number =>
  splits?.reduce((sum, split) => sum + split.percent, 0) ?? 0

/**
 * Determines if two lists of splits have any diff's within them.
 * @param splits1 {Split[]} - first list of splits
 * @param splits2 {Split[]} - second list of splits
 * @returns {boolean} - true if splits have a diff, false if the same.
 */
export function splitsListsHaveDiff(
  splits1: Split[] | undefined,
  splits2: Split[] | undefined,
) {
  if (!splits1 && !splits2) return false
  if ((splits1 && !splits2) || (!splits1 && splits2)) return true

  for (const split1 of splits1!) {
    const correspondingSplit = splits2!.find(split2 =>
      hasEqualRecipient(split1, split2),
    )

    if (!correspondingSplit) {
      return true
    }

    if (!isEqual(split1, correspondingSplit)) {
      return true
    }
  }
  return splits1!.length !== splits2!.length
}
