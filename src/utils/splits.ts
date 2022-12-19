import { BigNumber } from '@ethersproject/bignumber'
import * as constants from '@ethersproject/constants'
import { isEqual } from 'lodash'
import { PayoutMod } from 'models/mods'
import { OutgoingSplit, Split } from 'models/splits'
import {
  percentToPermyriad,
  permyriadToPercent,
} from 'utils/format/formatNumber'

import {
  formatSplitPercent,
  splitPercentFrom,
  SPLITS_TOTAL_PERCENT,
} from './v2v3/math'

//  - true if the split has been removed (exists in old but not new),
//  - false if new (exists in new but not old)
//  - Split if exists in old and new and there is a diff in the splits
//  - undefined if exists in old and new and there is no diff in the splits
export type OldSplit = Split | boolean | undefined

export type SplitWithDiff = Split & {
  oldSplit?: OldSplit
}

export const toSplit = (mod: PayoutMod): Split => {
  return {
    // mod.percent is a parts-per-ten thousand (permyriad),
    // split.percent is a parts-per-billion
    percent: splitPercentFrom(
      parseFloat(permyriadToPercent(mod.percent)),
    ).toNumber(),
    lockedUntil: mod.lockedUntil,
    beneficiary: mod.beneficiary,
    projectId: mod.projectId?.toHexString(),
    allocator: mod.allocator,
    preferClaimed: mod.preferUnstaked,
  }
}

export const toMod = (split: Split): PayoutMod => {
  return {
    // mod.percent is a parts-per-ten thousand (permyriad),
    // split.percent is a parts-per-billion
    percent: percentToPermyriad(
      formatSplitPercent(BigNumber.from(split.percent)),
    ).toNumber(),
    lockedUntil: split.lockedUntil,
    beneficiary: split.beneficiary,
    projectId: split.projectId ? BigNumber.from(split.projectId) : undefined,
    allocator: split.allocator,
    preferUnstaked: split.preferClaimed,
  }
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
): Split => {
  const totalSplitPercentage =
    splits?.reduce((sum, split) => sum + split.percent, 0) ?? 0
  const ownerPercentage = SPLITS_TOTAL_PERCENT - totalSplitPercentage

  return {
    beneficiary: projectOwnerAddress,
    percent: ownerPercentage,
    preferClaimed: false,
    lockedUntil: 0,
    projectId: BigNumber.from(0).toHexString(),
    allocator: constants.AddressZero,
  }
}

/**
 * Converts array of splits from transaction data (e.g. outgoing reconfig tx) to array of native Split objects
 * (Outgoing Split objects have percent and lockedUntil as BigNumbers)
 */
export const formatOutgoingSplits = (splits: OutgoingSplit[]): Split[] => {
  return (
    splits?.map(
      (split: OutgoingSplit) =>
        ({ ...split, percent: split.percent.toNumber() } as Split),
    ) ?? []
  )
}

const isProjectSplit = (split: Split) =>
  Boolean(split.projectId && parseInt(split.projectId) > 0)

// determines if two splits are the same 'entity' (either projectId or address)
const hasEqualRecipient = (a: Split, b: Split) => {
  const isProject = isProjectSplit(a)
  const idsEqual =
    a.projectId === b.projectId ||
    BigNumber.from(a.projectId).eq(b.projectId ?? 0) ||
    BigNumber.from(b.projectId).eq(a.projectId ?? 0)

  return (
    (isProject && idsEqual) || (!isProject && a.beneficiary === b.beneficiary)
  )
}

// returns a given list of splits sorted by percent allocation
const sortSplits = (splits: Split[]) => {
  return splits.sort((a, b) => (a.percent < b.percent ? 1 : -1))
}

// return list of splits that exist in oldSplits but not newSplits
export const getRemovedSplits = (oldSplits: Split[], newSplits: Split[]) => {
  return oldSplits.filter(oldSplit => {
    return !newSplits.some(newSplit => hasEqualRecipient(oldSplit, newSplit))
  })
}

// returns all unique splits (projectIds or addresses), sorted by their new `percent`
// and assigns each split an additional property `oldSplit` (OldSplit)
export const processUniqueSplits = ({
  oldSplits,
  newSplits,
}: {
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
      // adds diffed splits (exists in new and old and there is no diff)
      uniqueSplitsByProjectIdOrAddress.push({
        ...split,
        oldSplit,
      })
    } else if (oldSplit && splitsEqual) {
      // adds undiffed splits (exists in new and old and there is no diff)
      uniqueSplitsByProjectIdOrAddress.push({
        ...split,
        oldSplit: undefined,
      })
    } else {
      // add the new splits (exists in new but not old)
      uniqueSplitsByProjectIdOrAddress.push({
        ...split,
        oldSplit: false,
      })
    }
  })
  const removedSplits = getRemovedSplits(oldSplits, newSplits)
  removedSplits.map(split => {
    uniqueSplitsByProjectIdOrAddress.push({
      ...split,
      oldSplit: true,
    })
  })
  return sortSplits(uniqueSplitsByProjectIdOrAddress)
}
