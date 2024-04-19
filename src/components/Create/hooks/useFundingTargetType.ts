import { FundingTargetType } from 'models/fundingTargetType'
import { useMemo } from 'react'
import { MAX_DISTRIBUTION_LIMIT } from 'utils/v2v3/math'

export const useFundingTargetType = (
  fundingTargetAmount: bigint | undefined,
): FundingTargetType | undefined => {
  return useMemo(() => {
    if (!fundingTargetAmount || fundingTargetAmount === 0n) return undefined
    if (fundingTargetAmount === MAX_DISTRIBUTION_LIMIT) return 'infinite'
    return 'specific'
  }, [fundingTargetAmount])
}
