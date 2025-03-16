import { BigNumber, constants } from 'ethers'

export const WAD_DECIMALS = 18

export const SECONDS_IN_DAY = 24 * 60 * 60
export const SECONDS_IN_HOUR = 60 * 60
export const THREE_HOURS_IN_SECONDS = SECONDS_IN_HOUR * 3
export const THREE_DAYS_IN_SECONDS = SECONDS_IN_DAY * 3
export const SEVEN_DAYS_IN_HOURS = SECONDS_IN_DAY * 7

export const PROJECT_PAY_CHARACTER_LIMIT = 16

export const TEN_THOUSAND = 10_000
export const ONE_MILLION = 1_000_000
export const ONE_BILLION = 1_000_000_000
export const ONE_TRILLION = 1_000_000_000_000

export const MaxUint232 = constants.MaxUint256.add(1)
  .div(2 ** 24)
  .sub(1)
export const MaxUint88 = 2 ** 88 - 1
export const MaxUint54 = BigNumber.from(2).pow(54).sub(1)
