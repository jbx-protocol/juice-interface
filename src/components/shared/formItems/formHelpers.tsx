import { PayoutMod } from 'models/mods'
import { fromPermyriad } from 'utils/formatNumber'
import { constants, utils } from 'ethers'
import { BigNumber } from '@ethersproject/bignumber'

import {
  stripCommas,
  formatWad,
  parseWad,
  parsePermyriad,
} from 'utils/formatNumber'
import { amountSubFee, amountAddFee } from 'utils/math'

export type ModalMode = 'Add' | 'Edit' | undefined

// Get total percentages from a list of mods such as in Project->'Edit payouts'
export function getTotalPercentage(mods: PayoutMod[] | undefined) {
  return (
    mods?.reduce(
      (acc, curr) => acc + parseFloat(fromPermyriad(curr.percent ?? '0')),
      0,
    ) ?? 0
  )
}

// Ensures value is greater than 0 and less than 100
export function validatePercentage(percent: number | undefined) {
  if (percent === undefined || percent === 0) return Promise.reject('Required')
  else if (percent > 100) return Promise.reject('Invalid')
  return Promise.resolve()
}

// Validates an eth address from a modal where the address
// is being added to a set of addresses (such as payout or
// reserved token receivers)
// Ensures address is not null, 0, or the same as an already added address
export function validateEthAddress(
  address: string,
  mods: PayoutMod[],
  modalMode: ModalMode,
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

// Returns formatted 'funding target after fee'
// given 'funding target'
export const targetToTargetSubFeeFormatted = (
  target: string,
  fee: BigNumber | undefined,
) => {
  const newTargetSubFee = amountSubFee(parseWad(target ?? ''), fee)
  return stripCommas(formatWad(newTargetSubFee, { decimals: 4 }) || '0') // formatWad returns formatted bigNum with commas, must remove
}

// Returns formatted 'funding target' given
// 'funding target after fee'
export const targetSubFeeToTargetFormatted = (
  targetSubFee: string,
  fee: BigNumber | undefined,
) => {
  const newTarget = amountAddFee(parseWad(targetSubFee ?? '0'), fee)
  return stripCommas(formatWad(newTarget, { decimals: 4 }) || '0')
}

// Returns amount from a given percentage of the
// 'funding target after fee'
export function getAmountFromPercent(
  percent: number,
  target: string,
  fee: BigNumber | undefined,
) {
  return parseInt(
    stripCommas(
      formatWad(
        amountSubFee(parseWad(stripCommas(target)), fee)
          ?.mul(Math.floor((percent ?? 0) * 100))
          .div(10000),
        { decimals: 4, padEnd: true },
      ) ?? '0',
    ),
  )
}

// Return percent of 'funding target after fee' from
// a given amount
export function getPercentFromAmount(
  amount: number | undefined,
  target: string,
  fee: BigNumber | undefined,
) {
  let targetSubFeeBN = amountSubFee(parseWad(stripCommas(target)), fee)
  let targetSubFee = stripCommas(formatWad(targetSubFeeBN) ?? '0')

  return (((amount ?? 0) * 1.0) / parseFloat(targetSubFee)) * 100
}

// Returns number of decimal places in a given number
export function countDecimalPlaces(value: number | undefined) {
  if (value && Math.floor(value ?? 1) === value) return 0
  return value?.toString().split('.')[1]?.length || 0
}

// Rounds a value down to a certain number of decimal places if given, else takes floor
export function roundDown(value: number, decimalPlaces: number | undefined) {
  if (!decimalPlaces) return Math.floor(value)
  return parsePermyriad(value).toNumber() / 100
}
