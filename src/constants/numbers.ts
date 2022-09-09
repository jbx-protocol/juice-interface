import { BigNumber } from '@ethersproject/bignumber'
import * as constants from '@ethersproject/constants'

export const WAD_DECIMALS = 18

export const SECONDS_IN_DAY = 24 * 60 * 60
export const SECONDS_IN_HOUR = 60 * 60

export const PROJECT_PAY_CHARACTER_LIMIT = 16

export const TEN_THOUSAND = 10000
export const ONE_MILLION = 1000000
export const ONE_BILLION = 1000000000
export const ONE_TRILLION = 1000000000000

export const MaxUint232 = constants.MaxUint256.add(1)
  .div(2 ** 24)
  .sub(1)
export const MaxUint88 = 2 ** 88 - 1
export const MaxUint54 = BigNumber.from(2).pow(54).sub(1)
export const MaxUint48 = 2 ** 48 - 1
