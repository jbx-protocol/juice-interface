import { constants } from 'ethers'
import { getAddress } from 'ethers/lib/utils'

export function safeGetAddress(
  address: string | undefined,
): string | undefined {
  if (!address) return undefined
  try {
    return getAddress(address)
  } catch (e) {
    return undefined
  }
}

/**
 * Compare two addresses. Returns true if:
 * - both arguments exist
 * - both arguments are valid Ethereum addresses
 * - both arguments are the same address.
 */
export function isEqualAddress(
  a: string | undefined,
  b: string | undefined,
): boolean {
  const addressA = safeGetAddress(a)
  const addressB = safeGetAddress(b)
  return Boolean(addressA && addressB && addressA === addressB)
}

export function isZeroAddress(address: string | undefined): boolean {
  return isEqualAddress(address, constants.AddressZero)
}
