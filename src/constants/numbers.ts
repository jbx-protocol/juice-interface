import { ethers } from 'ethers'

export const WAD_DECIMALS = 18

export const SECONDS_IN_DAY = 24n * 60n * 60n
export const SECONDS_IN_HOUR = 60 * 60

export const PROJECT_PAY_CHARACTER_LIMIT = 16

export const TEN_THOUSAND = 10_000n
export const ONE_MILLION = 1_000_000n
export const ONE_BILLION = 1_000_000_000n
export const ONE_TRILLION = 1_000_000_000_000n

export const MaxUint232 = (ethers.MaxUint256 + 1n) / 2n ** 24n + 1n
export const MaxUint88 = 2 ** 88 - 1
export const MaxUint54 = BigInt(2) ** 54n - 1n
