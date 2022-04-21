import { BigNumber } from '@ethersproject/bignumber'
import { fromWad } from 'utils/formatNumber'

export function getDistributionAmountFromPercentAfterFee({
  percent,
  distributionLimit,
  feePercentage,
}: {
  percent: number
  distributionLimit: string | undefined
  feePercentage: string
}) {
  const amountBeforeFee = BigNumber.from(percent).mul(
    BigNumber.from(distributionLimit),
  )
  const amountAfterFee = amountBeforeFee.sub(
    amountBeforeFee.mul(BigNumber.from(feePercentage)),
  )

  return fromWad(amountAfterFee)
}

export function getDistributionAmountFromPercentBeforeFee({
  percent,
  distributionLimit,
}: {
  percent: number
  distributionLimit: string | undefined
}) {
  const amount = BigNumber.from(percent).mul(BigNumber.from(distributionLimit))

  return fromWad(amount)
}

export function getDistributionPercentFromAmount({
  amount, // Distribution amount before fee
  distributionLimit,
}: {
  amount: number
  distributionLimit: string | undefined
}) {
  const percent = BigNumber.from(amount).div(BigNumber.from(distributionLimit))

  return fromWad(percent)
}
