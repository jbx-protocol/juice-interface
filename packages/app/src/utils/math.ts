import { BigNumber } from '@ethersproject/bignumber'
import { Budget } from 'models/budget'

export const weightedRate = (
  budget: Budget | null | undefined,
  wei: BigNumber | undefined,
  percentage: BigNumber | undefined,
) =>
  budget && wei && percentage
    ? budget.weight.div(budget.target).mul(wei).mul(percentage).div(1000)
    : undefined

export const feeForAmount = (
  target?: BigNumber,
  adminFeePercent?: BigNumber,
) => {
  if (!adminFeePercent || !target) return

  return target.mul(adminFeePercent).div(1000)
}
