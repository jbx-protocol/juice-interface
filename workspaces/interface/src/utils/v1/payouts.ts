import { BigNumber } from '@ethersproject/bignumber'
import * as constants from '@ethersproject/constants'

import {
  formatWad,
  fromWad,
  parseWad,
  percentToPerbicent,
  stripCommas,
} from 'utils/formatNumber'
import { amountAddFee, amountSubFee } from 'utils/v1/math'

// Returns formatted 'funding target after fee'
// given 'funding target'
export const targetToTargetSubFeeFormatted = (
  target: string,
  fee: BigNumber | undefined,
) => {
  const newTargetSubFee = amountSubFee(parseWad(target ?? ''), fee)
  return fromWad(newTargetSubFee)
}

// Returns formatted 'funding target' given
// 'funding target after fee'
export const targetSubFeeToTargetFormatted = (
  targetSubFee: string,
  fee: BigNumber | undefined,
): string => {
  if (targetSubFee === fromWad(constants.MaxUint256)) {
    return fromWad(constants.MaxUint256)
  }
  const newTarget = amountAddFee(targetSubFee ?? '0', fee)
  return newTarget ?? '0'
}

// Returns amount from a given percentage of the
// 'funding target after fee'
export function getAmountFromPercent(
  percent: number,
  target: string,
  feePercentage: string | undefined,
) {
  const amount = fromWad(
    amountSubFee(
      parseWad(stripCommas(target)),
      percentToPerbicent(feePercentage),
    )
      ?.mul(Math.floor((percent ?? 0) * 100))
      .div(10000),
  )
  return parseFloat(amount)
}

// Return percent of 'funding target after fee' from
// a given amount
export function getPercentFromAmount(
  amount: number | undefined,
  target: string,
  feePercentage: string | undefined,
) {
  const targetSubFeeBN = amountSubFee(
    parseWad(stripCommas(target)),
    percentToPerbicent(feePercentage),
  )
  const targetSubFee = stripCommas(formatWad(targetSubFeeBN) ?? '0')
  const percent = (((amount ?? 0) * 1.0) / parseFloat(targetSubFee)) * 100
  return parseFloat(percent.toFixed(8))
}
