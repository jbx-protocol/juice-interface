import { feeForAmount } from 'utils/math'

export const MAX_PAYOUT_LIMIT = BigInt('26959946667150639794667015087019630673637144422540572481103610249215') // uint 224, probably a better way lol

export const amountSubFee = (
  amountWad: bigint | undefined,
  feePerBillion: bigint | undefined,
): bigint | undefined => {
  if (!feePerBillion || !amountWad) return
  const feeAmount = feeForAmount(amountWad, feePerBillion) ?? 0n
  return amountWad - feeAmount
}
