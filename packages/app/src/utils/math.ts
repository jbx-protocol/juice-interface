import { BigNumber } from '@ethersproject/bignumber'
import { FundingCycle } from 'models/fundingCycle'

export const weightedRate = (
  fc: FundingCycle | undefined,
  wei: BigNumber | undefined,
  percentage: BigNumber | undefined,
) =>
  fc && wei && percentage
    ? fc.weight.div(fc.target).mul(wei).mul(percentage).div(1000)
    : undefined

export const feeForAmount = (
  target?: BigNumber,
  adminFeePercent?: BigNumber,
) => {
  if (!adminFeePercent || !target) return

  return target.mul(adminFeePercent).div(1000)
}
