import { PayoutMod } from 'models/mods'
import { fromPermyriad } from 'utils/formatNumber'
import { constants, utils } from 'ethers'

// Get total percentages from a list of mods such as in Project->'Edit payouts'
export function getTotalPercentage(mods: PayoutMod[] | undefined) {
  return (
    mods?.reduce(
      (acc, curr) => acc + parseFloat(fromPermyriad(curr.percent ?? '0')),
      0,
    ) ?? 0
  )
}

export function validateDistributionPercent(percent: number | undefined) {
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
