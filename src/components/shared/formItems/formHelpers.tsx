import { PayoutMod } from 'models/mods'
import { fromPermyriad } from 'utils/formatNumber'
import { constants, utils } from 'ethers'
import { BigNumber } from '@ethersproject/bignumber'

import { stripCommas, formatWad, parseWad } from 'utils/formatNumber'
import { amountSubFee, amountAddFee } from 'utils/math'

// Get total percentages from a list of mods such as in Project->'Edit payouts'
export function getTotalPercentage(mods: PayoutMod[] | undefined) {
  return (
    mods?.reduce(
      (acc, curr) => acc + parseFloat(fromPermyriad(curr.percent ?? '0')),
      0,
    ) ?? 0
  )
}

export function validateGreaterThanZero(percent: number | undefined) {
  if (percent === undefined || percent === 0) return Promise.reject('Required')
  return Promise.resolve()
}

// Validates an eth address from a modal where the address
// is being added to a set of addresses (such as payout or
// reserved token receivers)
// Ensures address is not null, 0, or the same as an already added address
export function validateEthAddress(
  address: string,
  mods: PayoutMod[],
  modalMode: string | undefined,
  editingModIndex: number | undefined,
) {
  // If user edits an (already approved) address and doesn't change it, we accept
  if (
    modalMode === 'Edit' &&
    address === mods[editingModIndex ?? 0]?.beneficiary
  )
    return Promise.resolve()
  else if (!address || !utils.isAddress(address))
    return Promise.reject('Address is required')
  else if (address === constants.AddressZero)
    return Promise.reject('Cannot use zero address')
  else if (mods.some(mod => mod.beneficiary === address))
    return Promise.reject('A payout for this address already exists')
  else return Promise.resolve()
}

export const targetToTargetSubFeeFormatted = (
  target: string,
  adminFeePercent: BigNumber | undefined,
) => {
  let newTargetSubFee = amountSubFee(parseWad(target ?? '0'), adminFeePercent)
  return stripCommas(formatWad(newTargetSubFee, { decimals: 4 }) || '0') // formatWad returns formatted bigNum with commas, must remove
}

export const targetSubFeeToTargetFormatted = (
  targetSubFee: string,
  adminFeePercent: BigNumber | undefined,
) => {
  let newTarget = amountAddFee(parseWad(targetSubFee ?? '0'), adminFeePercent)
  return stripCommas(formatWad(newTarget, { decimals: 4 }) || '0')
}

export function getAmountFromPercent(
  percent: number,
  target: string,
  fee: BigNumber | undefined,
) {
  return formatWad(
    amountSubFee(parseWad(target), fee)
      ?.mul(Math.floor((percent ?? 0) * 100))
      .div(10000),
    { decimals: 4, padEnd: true },
  )
}
