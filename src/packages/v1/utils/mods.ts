import { TEN_THOUSAND } from 'constants/numbers'
import { ethers } from 'ethers'

import { PayoutMod, TicketMod } from 'packages/v1/models/mods'

export const MODS_TOTAL_PERCENT = TEN_THOUSAND // = 100%

/**
 * Return a PayoutMod object that represents the remaining percentage allocated to the project owner.
 *
 * In the Juicebox protocol, if the sum of the payout mod percentages is less than 100%,
 * the remainder gets allocated to the project owner.
 */
export const getProjectOwnerRemainderPayoutMod = (
  projectOwnerAddress: string,
  splits: PayoutMod[],
): PayoutMod => {
  const totalSplitPercentage =
    splits?.reduce((sum, split) => sum + split.percent, 0) ?? 0
  const ownerPercentage = Number(MODS_TOTAL_PERCENT) - totalSplitPercentage

  return {
    beneficiary: projectOwnerAddress,
    percent: ownerPercentage,
    preferUnstaked: false,
    lockedUntil: 0,
    projectId: BigInt(0),
    allocator: ethers.ZeroAddress,
  }
}

/**
 * Return a TicketMod object that represents the remaining percentage allocated to the project owner.
 *
 * In the Juicebox protocol, if the sum of the ticket mod percentages is less than 100%,
 * the remainder gets allocated to the project owner.
 */
export const getProjectOwnerRemainderTicketMod = (
  projectOwnerAddress: string,
  splits: TicketMod[],
): TicketMod => {
  const totalSplitPercentage =
    splits?.reduce((sum, split) => sum + split.percent, 0) ?? 0
  const ownerPercentage = Number(MODS_TOTAL_PERCENT) - totalSplitPercentage

  return {
    beneficiary: projectOwnerAddress,
    percent: ownerPercentage,
    preferUnstaked: false,
    lockedUntil: 0,
  }
}
