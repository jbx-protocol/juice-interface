import { BigNumber } from '@ethersproject/bignumber'
import * as constants from '@ethersproject/constants'
import { TEN_THOUSAND } from 'constants/numbers'
import { PayoutMod, TicketMod } from 'models/mods'

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
  const ownerPercentage = MODS_TOTAL_PERCENT - totalSplitPercentage

  return {
    beneficiary: projectOwnerAddress,
    percent: ownerPercentage,
    preferUnstaked: false,
    lockedUntil: 0,
    projectId: BigNumber.from(0),
    allocator: constants.AddressZero,
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
  const ownerPercentage = MODS_TOTAL_PERCENT - totalSplitPercentage

  return {
    beneficiary: projectOwnerAddress,
    percent: ownerPercentage,
    preferUnstaked: false,
    lockedUntil: 0,
  }
}
