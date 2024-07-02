import { BigNumber } from 'ethers'
import { FundingTargetType } from 'models/fundingTargetType'
import { MAX_DISTRIBUTION_LIMIT } from 'packages/v2v3/utils/math'
import { useMemo } from 'react'

export const useFundingTargetType = (
  fundingTargetAmount: BigNumber | undefined,
): FundingTargetType | undefined => {
  return useMemo(() => {
    if (!fundingTargetAmount || fundingTargetAmount.eq(0)) return undefined
    if (fundingTargetAmount.eq(MAX_DISTRIBUTION_LIMIT)) return 'infinite'
    return 'specific'
  }, [fundingTargetAmount])
}
