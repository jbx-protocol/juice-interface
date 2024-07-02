import { FundingTargetType } from 'models/fundingTargetType'
import { isInfiniteDistributionLimit } from 'packages/v2v3/utils/fundingCycle'
import { useMemo } from 'react'

export const useFundingTargetType = (
  fundingTargetAmount: bigint | undefined,
): FundingTargetType | undefined => {
  return useMemo(() => {
    if (!fundingTargetAmount || fundingTargetAmount === 0n) return undefined
    if (isInfiniteDistributionLimit(fundingTargetAmount)) return 'infinite'
    return 'specific'
  }, [fundingTargetAmount])
}
