import { BigNumber } from '@ethersproject/bignumber'

import { parseWad } from './formatNumber'

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
