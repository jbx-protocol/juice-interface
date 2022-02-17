import { BigNumber } from '@ethersproject/bignumber'

import { parseWad } from './formatNumber'

export const bigNumbersDiff = (a?: BigNumber, b?: BigNumber) => {
  if ((a && !b) || (!a && b)) return true

  return a && b ? !a.eq(b) : false
}

export const betweenZeroAndOne = (amount: BigNumber) => {
  return amount?.lt(parseWad('1')) && amount.gt(0)
}
