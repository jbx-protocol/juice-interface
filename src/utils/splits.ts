import { BigNumber } from '@ethersproject/bignumber'
import * as constants from '@ethersproject/constants'
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
    allocator: constants.AddressZero,
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
