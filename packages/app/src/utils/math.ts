import { BigNumber } from '@ethersproject/bignumber'
import { FundingCycle } from 'models/funding-cycle'

import { fromWad, parsePerbicent } from './formatNumber'
import { decodeFCMetadata } from './fundingCycle'

export const weightedRate = (
  fc: FundingCycle | undefined,
  wad: BigNumber | undefined,
  output: 'payer' | 'reserved',
) => {
  if (!fc || !wad) return
  const reserved = decodeFCMetadata(fc.metadata)?.reservedRate

  if (reserved === undefined) return

  return fromWad(
    fc.weight
      .mul(wad)
      .mul(output === 'reserved' ? reserved : parsePerbicent(100).sub(reserved))
      .div(200),
  )
}

export const feeForAmount = (
  amount?: BigNumber,
  adminFeePercent?: BigNumber,
) => {
  if (!adminFeePercent || !amount) return
  return amount.sub(amount.mul(200).div(adminFeePercent.add(200)))
}

export const amountSubFee = (
  amount?: BigNumber,
  adminFeePercent?: BigNumber,
) => {
  if (!adminFeePercent || !amount) return
  return amount.sub(feeForAmount(amount, adminFeePercent) ?? 0)
}
