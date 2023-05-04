import { BigNumber, BigNumberish } from 'ethers'

import { isBytes, isHexString } from 'ethers/lib/utils'
import { parseWad } from './format/formatNumber'

export function isBigNumberish(value: unknown): value is BigNumberish {
  return (
    value != null &&
    (BigNumber.isBigNumber(value) ||
      (typeof value === 'number' && value % 1 === 0) ||
      (typeof value === 'string' && !!value.match(/^-?[0-9]+$/)) ||
      isHexString(value) ||
      typeof value === 'bigint' ||
      isBytes(value))
  )
}

export const bigNumbersDiff = (a?: BigNumber, b?: BigNumber) => {
  if ((a && !b) || (!a && b)) return true

  return a && b ? !a.eq(b) : false
}

export const betweenZeroAndOne = (amount: BigNumber) => {
  return amount?.lt(parseWad('1')) && amount.gt(0)
}

// permyriad: x/10000
/**
 * Return value subtracted from 10,000 (1 permyriad).
 * Useful for when contracts store inverse values to save storage.
 * permyriad: x/10000
 * @param permyriad
 * @returns
 */
export const invertPermyriad = (permyriad: BigNumber) => {
  return BigNumber.from(10000).sub(permyriad)
}

/**
 * Unpad any extra leading zeros on a hex number.
 */
export const unpadLeadingZerosString = (num: string) => {
  if (!num.match(/^0x/)) {
    throw new Error('Invalid number passed to unpadLeadingZerosString')
  }
  num = num.slice(2)
  while (num.length > 0) {
    if (num[0] === '0') {
      num = num.slice(1)
      continue
    }
    break
  }
  return `0x${num}`
}
