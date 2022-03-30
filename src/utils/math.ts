import { BigNumber } from '@ethersproject/bignumber'

import { invertPermyriad } from './bigNumbers'

import { fromWad, percentToPerbicent, percentToPermyriad } from './formatNumber'

export type WeightFunction = (
  weight: BigNumber | undefined,
  reservedRate: number | undefined,
  wadAmount: BigNumber | undefined,
  outputType: 'payer' | 'reserved',
) => string | undefined

/**
 * Return a given [amountWad] weighted by a given [weight] and [reservedRatePerbicent].
 *
 * Typically only used by Juicebox V1 projects.
 *
 * @param weight - scalar value for weighting. Typically funding cycle weight.
 * @param reservedRatePerbicent - reserve rate, as a perbicent (x/200)
 * @param amountWad - amount to weight, as a wad.
 * @param outputType
 */
export const weightedRate: WeightFunction = (
  weight: BigNumber | undefined,
  reservedRatePerbicent: number | undefined,
  wadAmount: BigNumber | undefined,
  outputType: 'payer' | 'reserved',
) => {
  if (!weight || !wadAmount) return

  if (reservedRatePerbicent === undefined) return

  return fromWad(
    weight
      .mul(wadAmount)
      .mul(
        outputType === 'reserved'
          ? reservedRatePerbicent
          : percentToPerbicent(100).sub(reservedRatePerbicent),
      )
      .div(percentToPerbicent(100)),
  )
}

/**
 * Return a given [amountWad] weighted by a given [weight] and [reservedRatePermyriad].
 *
 * Typically only used by Juicebox V2 projects.
 *
 * @param weight - scalar value for weighting. Typically funding cycle weight.
 * @param reservedRatePermyriad - reserve rate, as a permyriad (x/10,000)
 * @param amountWad - amount to weight, as a wad.
 * @param outputType
 * @returns
 */
export const weightedAmount: WeightFunction = (
  weight: BigNumber | undefined,
  reservedRatePermyriad: number | undefined,
  amountWad: BigNumber | undefined,
  outputType: 'payer' | 'reserved',
) => {
  if (!weight || !amountWad) return

  if (reservedRatePermyriad === undefined) return

  return fromWad(
    amountWad
      .mul(weight)
      .mul(
        outputType === 'reserved'
          ? reservedRatePermyriad
          : invertPermyriad(BigNumber.from(reservedRatePermyriad)),
      )
      .div(percentToPermyriad(100)),
  )
}

export const feeForAmount = (
  amount: BigNumber | undefined,
  feePercent: BigNumber | undefined,
) => {
  if (!feePercent || !amount) return
  return amount.sub(amount.mul(200).div(feePercent.add(200)))
}

export const amountSubFee = (amount?: BigNumber, feePercent?: BigNumber) => {
  if (!feePercent || !amount) return
  return amount.sub(feeForAmount(amount, feePercent) ?? 0)
}

/**
 * new amount = old amount / (1 - fee)
 */
export const amountAddFee = (amount?: string, feePerbicent?: BigNumber) => {
  if (!feePerbicent || !amount) return

  const inverseFeePerbicent = percentToPerbicent(100).sub(feePerbicent)
  const amountPerbicent = BigNumber.from(amount).mul(percentToPerbicent(100))
  // new amount is in regular decimal units
  const newAmount = amountPerbicent.div(inverseFeePerbicent)

  return newAmount.toString()
}
