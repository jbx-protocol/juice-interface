import { BigNumber } from '@ethersproject/bignumber'

export const bigNumbersEq = (a?: BigNumber, b?: BigNumber) =>
  a && b ? a?.eq(b) : false
