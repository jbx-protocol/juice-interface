import { BigNumber } from '@ethersproject/bignumber'

export const bigNumbersDiff = (a?: BigNumber, b?: BigNumber) => {
  if ((a && !b) || (!a && b)) return true

  return a && b ? !a.eq(b) : false
}
