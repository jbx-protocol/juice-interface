import { BigNumber } from '@ethersproject/bignumber'
import { FundingCycle } from 'models/funding-cycle'

import { fromWad, parsePerbicent } from './formatNumber'
import { decodeFundingCycleMetadata } from './fundingCycle'

export const weightedRate = (
  fc: FundingCycle | undefined,
  wad: BigNumber | undefined,
  output: 'payer' | 'reserved',
) => {
  if (!fc || !wad) return
  const reserved = decodeFundingCycleMetadata(fc.metadata)?.reservedRate

  if (reserved === undefined) return

  return fromWad(
    fc.weight
      .mul(wad)
      .mul(output === 'reserved' ? reserved : parsePerbicent(100).sub(reserved))
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
  return amount.add(feeForAmount(amount, feePercent) ?? 0)
}
