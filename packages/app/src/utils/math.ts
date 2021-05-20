import { BigNumber } from '@ethersproject/bignumber'
import { FundingCycle } from 'models/funding-cycle'

import { parsePerMille } from './formatCurrency'
import { decodeFCMetadata } from './fundingCycle'

export const weightedRate = (
  fc: FundingCycle | undefined,
  wad: BigNumber | undefined,
  output: 'payer' | 'reserved',
) => {
  if (!fc || !wad) return
  const reserved = decodeFCMetadata(fc.metadata)?.reserved

  if (!reserved) return

  return fc.weight
    .mul(wad)
    .mul(
      output === 'reserved'
        ? reserved
        : parsePerMille('100').sub(reserved ?? 0),
    )
    .div(1000)
}

export const feeForAmount = (
  target?: BigNumber,
  adminFeePercent?: BigNumber,
) => {
  if (!adminFeePercent || !target) return

  return target.mul(adminFeePercent).div(1000)
}
