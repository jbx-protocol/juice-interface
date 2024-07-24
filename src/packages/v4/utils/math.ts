import * as constants from '@ethersproject/constants'
import { feeForAmount } from 'utils/math'

export const MAX_PAYOUT_LIMIT = constants.MaxUint256.toBigInt()

export const amountSubFee = (
  amountWad: bigint | undefined,
  feePerBillion: bigint | undefined,
): bigint | undefined => {
  if (!feePerBillion || !amountWad) return
  const feeAmount = feeForAmount(amountWad, feePerBillion) ?? 0n
  return amountWad - feeAmount
}
