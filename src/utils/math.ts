import { BigNumber } from '@ethersproject/bignumber'

import { fromWad, percentToPerbicent } from './formatNumber'
import { decodeFundingCycleMetadata } from './v1/fundingCycle'

export const weightedRate = (
  weight: BigNumber | undefined,
  reservedRate: number | undefined,
  wad: BigNumber | undefined,
  output: 'payer' | 'reserved',
) => {
  if (!weight || !wad) return

  if (reservedRate === undefined) return

  return fromWad(
    weight
      .mul(wad)
      .mul(
        output === 'reserved'
          ? reservedRate
          : percentToPerbicent(100).sub(reservedRate),
      )
      .div(200),
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

export const amountAddFee = (amount?: BigNumber, feePercent?: BigNumber) => {
  if (!feePercent || !amount) return
  return amount.add(amount.mul(100).div(feePercent.mul(200)))
}
