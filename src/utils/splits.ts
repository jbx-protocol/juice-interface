import { BigNumber, constants } from 'ethers'
import isEqual from 'lodash/isEqual'
import { Split, SplitParams } from 'models/splits'

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
  const isProject = isProjectSplit(a)
  const idsEqual =
    a.projectId === b.projectId ||
    BigNumber.from(a.projectId).eq(b.projectId ?? 0) ||
    BigNumber.from(b.projectId).eq(a.projectId ?? 0)

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
    projectId: split.projectId ?? BigNumber.from(0).toHexString(),
    beneficiary: split.beneficiary ?? constants.AddressZero,
    allocator: split.allocator ?? constants.AddressZero,
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
  const ownerPercentage = SPLITS_TOTAL_PERCENT - totalSplitPercentage

  return {
    beneficiary: projectOwnerAddress,
    percent: ownerPercentage,
    preferClaimed: false,
    lockedUntil: 0,
    projectId: BigNumber.from(0).toHexString(),
    allocator: constants.AddressZero,
    isProjectOwner: true,
  }
}

/**
 * Converts array of splits from transaction data (e.g. outgoing reconfig tx) to array of native Split objects
 * (Outgoing Split objects have percent and lockedUntil as BigNumbers)
 */
export const toSplit = (splits: SplitParams[]): Split[] => {
  return (
    splits?.map(
      (split: SplitParams) =>
        ({ ...split, percent: split.percent.toNumber() } as Split),
    ) ?? []
  )
}

// returns a given list of splits sorted by percent allocation
export const sortSplits = (splits: Split[]) => {
  return [...splits].sort((a, b) => (a.percent < b.percent ? 1 : -1))
}

// returns all unique splits (projectIds or addresses), sorted by their new `percent`
// and assigns each split an additional property `oldSplit` (OldSplit)
export const processUniqueSplits = ({
  oldTotalValue,
  oldSplits,
  newSplits,
}: {
  oldTotalValue?: BigNumber
  oldSplits: Split[] | undefined
  newSplits: Split[]
}): SplitWithDiff[] => {
  const uniqueSplitsByProjectIdOrAddress: Array<SplitWithDiff> = []
  if (!oldSplits) return sortSplits(newSplits)

  newSplits.map(split => {
    const oldSplit = oldSplits.find(oldSplit =>
      hasEqualRecipient(oldSplit, split),
    )

    const splitsEqual = isEqual(split, oldSplit)

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
      // adds undiffed splits (exists in new and old and there is no diff)
      uniqueSplitsByProjectIdOrAddress.push({
        ...split,
        oldSplit: undefined,
      })
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
  return Boolean(split.projectId) && BigNumber.from(split.projectId).gt(0)
}

export const projectIdToHex = (projectIdString: string | undefined) =>
  BigNumber.from(projectIdString ?? 0).toHexString()

// Returns the sum of each split's percent in a list of splits
export const totalSplitsPercent = (splits: Split[]) =>
  splits?.reduce((sum, split) => sum + split.percent, 0) ?? 0
