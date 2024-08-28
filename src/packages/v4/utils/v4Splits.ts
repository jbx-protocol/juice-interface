import * as constants from '@ethersproject/constants'
import { JBSplit, SplitPortion, SPLITS_TOTAL_PERCENT } from 'juice-sdk-core'
import isEqual from 'lodash/isEqual'
import round from 'lodash/round'
import { formatWad } from 'utils/format/formatNumber'
import { Hash } from 'viem'
import { isFinitePayoutLimit } from './fundingCycle'

/**
 * Return a Split object that represents the remaining percentage allocated to the project owner.
 *
 * In the Juicebox protocol, if the sum of the split percentages is less than 100%,
 * the remainder gets allocated to the project owner.
 */
export const v4GetProjectOwnerRemainderSplit = (
  projectOwnerAddress: Hash,
  splits: JBSplit[],
): JBSplit & { isProjectOwner: true } => {
  const totalSplitPercentage = totalSplitsPercent(splits)
  const ownerPercentage = new SplitPortion(
    SPLITS_TOTAL_PERCENT - Number(totalSplitPercentage),
  )

  return {
    beneficiary: projectOwnerAddress,
    percent: ownerPercentage,
    lockedUntil: 0,
    projectId: 0n,
    isProjectOwner: true,
    preferAddToBalance: false,
    hook: constants.AddressZero,
  }
}

/**
 * Returns the sum of each split's percent in a list of splits
 * @param splits {JBSplit[]} - list of splits to sum percents
 * @returns {bigint} - sum of percents in part-per-billion (max = SPLITS_TOTAL_PERCENT)
 */
export const totalSplitsPercent = (splits: JBSplit[]): bigint =>
  splits?.reduce((sum, split) => sum + split.percent.value, 0n) ?? 0n

//  - true if the split has been removed (exists in old but not new),
//  - false if new (exists in new but not old)
//  - JBSplit if exists in old and new and there is a diff in the splits
//  - undefined if exists in old and new and there is no diff in the splits
type OldSplit = (JBSplit & { totalValue?: bigint } ) | boolean | undefined

export type SplitWithDiff = JBSplit & {
  oldSplit?: OldSplit
}

// determines if two splits are the same 'entity' (either projectId or address)
export const hasEqualRecipient = (a: JBSplit, b: JBSplit) => {
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
const getRemovedSplits = (oldSplits: JBSplit[], newSplits: JBSplit[]) => {
  return oldSplits.filter(oldSplit => {
    return !newSplits.some(newSplit => hasEqualRecipient(oldSplit, newSplit))
  })
}

export const sanitizeSplit = (split: JBSplit): JBSplit => {
  return {
    lockedUntil: split.lockedUntil ?? 0n,
    projectId: split.projectId ?? '0x0',
    beneficiary: split.beneficiary ?? constants.AddressZero,
    hook: split.hook ?? constants.AddressZero,
    preferAddToBalance: false,
    percent: split.percent,
  }
}

/**
 * Converts array of splits from transaction data (e.g. outgoing reconfig tx) to array of native JBSplit objects
 * (Outgoing Split objects have percent and lockedUntil as bigints)
 */
export const toSplit = (splits: JBSplit[]): JBSplit[] => {
  return (
    splits?.map(
      (split: JBSplit) => ({ ...split, percent: split.percent } as JBSplit),
    ) ?? []
  )
}

// returns a given list of splits sorted by percent allocation
export const sortSplits = (splits: JBSplit[]) => {
  return [...splits].sort((a, b) => (a.percent < b.percent ? 1 : -1))
}

/* Determines if two splits AMOUNTS are equal. Extracts amounts for two splits from their respective totalValues **/
export function splitAmountsAreEqual({
  split1,
  split2,
  split1TotalValue,
  split2TotalValue,
}: {
  split1: JBSplit
  split2: JBSplit
  split1TotalValue: bigint
  split2TotalValue: bigint
}) {
  const split1Amount = formatWad(
    (split1TotalValue * split1.percent.value) / BigInt(SPLITS_TOTAL_PERCENT),
    {
      precision: 2,
    },
  )
  const split2Amount = formatWad(
    (split2TotalValue * split2.percent.value) / BigInt(SPLITS_TOTAL_PERCENT),
    {
      precision: 2,
    },
  )
  return split2Amount === split1Amount
}

/* Determines if two splits are equal. If given totalValues, uses the amount of each split instead of its percent **/
function splitsAreEqual({
  split1,
  split2,
  split1TotalValue,
  split2TotalValue,
}: {
  split1: JBSplit
  split2: JBSplit
  split1TotalValue: bigint
  split2TotalValue: bigint
}) {
  const isFiniteTotalValue =
    isFinitePayoutLimit(split1TotalValue) &&
    isFinitePayoutLimit(split2TotalValue)
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
    split1.hook === split2.hook &&
    split1.lockedUntil === split2.lockedUntil &&
    split1.projectId === split2.projectId &&
    split1.preferAddToBalance === split2.preferAddToBalance
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
  oldSplits: JBSplit[] | undefined
  newSplits: JBSplit[]
  allSplitsChanged?: boolean // pass when you know all splits have changed (e.g. currency has changed)
}): Array<
  SplitWithDiff & {
    totalValue?: number
    oldSplit?: OldSplit & { totalValue?: bigint }
  }
> => {
  const uniqueSplitsByProjectIdOrAddress: Array<
    SplitWithDiff & {
      totalValue?: bigint
      oldSplit?: OldSplit & { totalValue?: bigint }
    }
  > = []
  if (!oldSplits) {
    return sortSplits(newSplits)
  }

  newSplits.map(split => {
    const oldSplit = oldSplits.find(oldSplit =>
      hasEqualRecipient(oldSplit, split),
    )
    const splitsEqual =
      oldSplit && !allSplitsChanged && newTotalValue && oldTotalValue
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

export const isProjectSplit = (split: JBSplit): boolean => {
  return Boolean(split.projectId) && split.projectId > 0n
}

/**
 * Determines if two lists of splits have any diff's within them.
 * @param splits1 {JBSplit[]} - first list of splits
 * @param splits2 {JBSplit[]} - second list of splits
 * @returns {boolean} - true if splits have a diff, false if the same.
 */
export function splitsListsHaveDiff(
  splits1: JBSplit[] | undefined,
  splits2: JBSplit[] | undefined,
) {
  if (!splits1 && !splits2) return false
  if ((splits1 && !splits2) || (!splits1 && splits2)) return true

  for (const split1 of splits1 ?? []) {
    const correspondingSplit = splits2?.find(split2 =>
      hasEqualRecipient(split1, split2),
    )

    if (!correspondingSplit || !isEqual(split1, correspondingSplit)) {
      return true
    }
  }

  return splits1?.length !== splits2?.length
}

// Determines if a split is a Juicebox project
export function isJuiceboxProjectSplit(split: JBSplit) {
  return split.projectId ? split.projectId > 0n : false
}

// e.g. Converts 10 to 100000000 (10% of SPLITS_TOTAL_PERCENT)
export const splitPortionFromFormattedPercent = (percentage: number): bigint => {
  return percentage
    ? BigInt(round((percentage * SPLITS_TOTAL_PERCENT) / 100))
    : 0n
}
