import { FundingTargetType } from 'models/fundingTargetType'
import { MAX_PAYOUT_LIMIT } from 'packages/v4/utils/math'
import { useMemo } from 'react'

export const useFundingTargetType = (
  fundingTargetAmount: bigint | undefined,
): FundingTargetType | undefined => {
  return useMemo(() => {
    if (!fundingTargetAmount || fundingTargetAmount === 0n) return undefined
    if (fundingTargetAmount === MAX_PAYOUT_LIMIT) return 'infinite'
    return 'specific'
  }, [fundingTargetAmount])
}
