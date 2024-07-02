import { FundingTargetType } from 'models/fundingTargetType'
import { useMemo } from 'react'
import { isInfiniteDistributionLimit } from 'utils/v2v3/fundingCycle'

export const useFundingTargetType = (
  fundingTargetAmount: bigint | undefined,
): FundingTargetType | undefined => {
  return useMemo(() => {
    if (!fundingTargetAmount || fundingTargetAmount === 0n) return undefined
    if (isInfiniteDistributionLimit(fundingTargetAmount)) return 'infinite'
    return 'specific'
  }, [fundingTargetAmount])
}
