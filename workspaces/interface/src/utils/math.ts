import { BigNumber } from '@ethersproject/bignumber'

export type WeightFunction = (
  weight: BigNumber | undefined,
  reservedRate: number | undefined,
  wadAmount: BigNumber | undefined,
  outputType: 'payer' | 'reserved',
) => string

// Determines if a string value contains only digits
export const stringIsDigit = (value: string) => {
  return /^\d+$/.test(value)
}
