import { MAX_PAYOUT_LIMIT } from "./math"

export const WEIGHT_ZERO = 1 // send `1` when we want to set the weight to `0`
export const WEIGHT_UNCHANGED = 0 // send `0` when we don't want to change the weight.

export function isInfinitePayoutLimit(
  payoutLimit: bigint | undefined,
) {
  return (
    payoutLimit === undefined ||
    payoutLimit === MAX_PAYOUT_LIMIT
  )
}

// Not zero and not infinite
export const isFinitePayoutLimit = (
  payoutLimit: bigint | undefined,
): boolean => {
  return Boolean(
    payoutLimit &&
      !(payoutLimit === 0n) &&
      !isInfinitePayoutLimit(payoutLimit),
  )
}
