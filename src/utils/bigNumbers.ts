import { ethers } from 'ethers'
import { parseWad } from './format/formatNumber'

export type BigintIsh = bigint | string | number

export function isBigintIsh(value: unknown): value is BigintIsh {
  return (
    value != null &&
    ((typeof value === 'number' && value % 1 === 0) ||
      (typeof value === 'string' && !!value.match(/^-?[0-9]+$/)) ||
      ethers.isHexString(value) ||
      typeof value === 'bigint' ||
      ethers.isBytesLike(value))
  )
}

export const bigintsDiff = (a?: bigint, b?: bigint) => {
  if ((a && !b) || (!a && b)) return true
  return a !== b
}

export const betweenZeroAndOne = (amount: bigint) => {
  return amount < parseWad('1') && amount > 0n
}

// permyriad: x/10000
/**
 * Return value subtracted from 10,000 (1 permyriad).
 * Useful for when contracts store inverse values to save storage.
 * permyriad: x/10000
 * @param permyriad
 * @returns
 */
export const invertPermyriad = (permyriad: bigint) => {
  return 10000n - permyriad
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

export const toHexString = (num: bigint) => {
  // A hack to allow for undefined values to be passed in.
  if (num === undefined) return undefined as unknown as string
  return `0x${num.toString(16)}`
}
