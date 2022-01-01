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
  fee: BigNumber | undefined,
) => {
  let newTargetSubFee = amountSubFee(parseWad(target ?? ''), fee)
  return stripCommas(formatWad(newTargetSubFee, { decimals: 4 }) || '0') // formatWad returns formatted bigNum with commas, must remove
}

export const targetSubFeeToTargetFormatted = (
  targetSubFee: string,
  fee: BigNumber | undefined,
) => {
  let newTarget = amountAddFee(parseWad(targetSubFee ?? '0'), fee)
  return stripCommas(formatWad(newTarget, { decimals: 4 }) || '0')
}

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

export function getPercentFromAmount(
  amount: number | undefined,
  target: string,
  fee: BigNumber | undefined,
) {
  let targetSubFeeBN = amountSubFee(parseWad(stripCommas(target)), fee)
  let targetSubFee = parseInt(stripCommas(formatWad(targetSubFeeBN) ?? '0'))
  let percent = amount ?? 0 / (targetSubFee ?? 1)
  return percent / 1000
}
