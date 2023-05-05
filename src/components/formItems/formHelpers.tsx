import { isAddress } from 'ethers/lib/utils'
import { PayoutMod } from 'models/v1/mods'
import { permyriadToPercent } from 'utils/format/formatNumber'

import { Split } from 'models/splits'
import { isEqualAddress, isZeroAddress } from 'utils/address'
import { percentToPermyriad } from 'utils/format/formatNumber'

import { t } from '@lingui/macro'

export type ModalMode = 'Add' | 'Edit' | undefined

// Get total percentages from a list of mods such as in Project->'Edit payouts'
export function getTotalPercentage(mods: PayoutMod[] | undefined) {
  return (
    mods?.reduce(
      (acc, curr) => acc + parseFloat(permyriadToPercent(curr.percent ?? '0')),
      0,
    ) ?? 0
  )
}

// Ensures value is greater than 0 and less than 100
export function validatePercentage(percent: number | undefined) {
  if (percent === undefined || percent === 0) return Promise.reject(t`Required`)
  else if (percent > 100) return Promise.reject(t`Invalid`)
  return Promise.resolve()
}

// Validates an eth address from a modal where the address
// is being added to a set of addresses (such as payout or
// reserved token receivers)
// Ensures address is not null, 0, or the same as an already added address
export function validateEthAddress(
  address: string,
  mods: PayoutMod[] | Split[],
  modalMode: ModalMode,
  editingModIndex: number | undefined,
  canBeDuplicate?: boolean,
) {
  // If user edits an (already approved) address and doesn't change it, we accept
  if (
    modalMode === 'Edit' &&
    isEqualAddress(address, mods[editingModIndex ?? 0]?.beneficiary)
  )
    return Promise.resolve()
  else if (!address || !isAddress(address))
    return Promise.reject(t`An address is required`)
  else if (isZeroAddress(address))
    return Promise.reject(t`Cannot use zero address`)
  else if (!canBeDuplicate && mods.some(mod => mod.beneficiary === address))
    return Promise.reject(t`There is already a payout for this address`)
  else return Promise.resolve()
}

// Returns number of decimal places in a given number
export function countDecimalPlaces(value: number | undefined) {
  if (value && Math.floor(value ?? 1) === value) return 0
  return value?.toString().split('.')[1]?.length || 0
}

// Rounds a value down to a certain number of decimal places if given, else takes floor
export function roundDown(value: number, decimalPlaces: number | undefined) {
  if (!decimalPlaces) return Math.floor(value)
  return percentToPermyriad(value).toNumber() / 100
}
