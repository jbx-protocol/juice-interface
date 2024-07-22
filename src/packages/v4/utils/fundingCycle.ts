import { MAX_PAYOUT_LIMIT } from "./math"

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
