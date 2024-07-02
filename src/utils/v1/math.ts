import { fromWad, percentToPerbicent } from 'utils/format/formatNumber'
import { WeightFunction } from 'utils/math'

export const feeForAmount = (
  amount: bigint | undefined,
  feePerbicent: bigint | undefined,
) => {
  if (!feePerbicent || !amount) return
  return amount - (amount * 200n) / (feePerbicent + 200n)
}

export const amountSubFee = (amount?: bigint, feePerbicent?: bigint) => {
  if (!feePerbicent || !amount) return
  return amount - (feeForAmount(amount, feePerbicent) ?? 0n)
}

/**
 * new amount = old amount / (1 - fee)
 */
export const amountAddFee = (amount?: string, feePerbicent?: bigint) => {
  if (!feePerbicent || !amount) return

  const inverseFeePerbicent = percentToPerbicent(100) - feePerbicent
  const amountPerbicent = BigInt(amount) * percentToPerbicent(100)
  // new amount is in regular decimal units
  const newAmount = amountPerbicent / inverseFeePerbicent

  return newAmount.toString()
}

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
export const weightAmountPerbicent: WeightFunction = (
  weight: bigint | undefined,
  reservedRatePerbicent: number | undefined,
  wadAmount: bigint | undefined,
  outputType: 'payer' | 'reserved',
) => {
  if (!weight || !wadAmount) return '0'

  if (reservedRatePerbicent === undefined) return '0'

  const value =
    (weight *
      wadAmount *
      (outputType === 'reserved'
        ? BigInt(reservedRatePerbicent)
        : percentToPerbicent(100) - BigInt(reservedRatePerbicent))) /
    percentToPerbicent(100)
  return fromWad(value)
}
