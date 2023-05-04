import { BigNumber } from 'ethers'
import { FundingTargetType } from 'models/fundingTargetType'
import { useMemo } from 'react'
import { MAX_DISTRIBUTION_LIMIT } from 'utils/v2v3/math'

export const useFundingTargetType = (
  fundingTargetAmount: BigNumber | undefined,
): FundingTargetType | undefined => {
  return useMemo(() => {
    if (!fundingTargetAmount || fundingTargetAmount.eq(0)) return undefined
    if (fundingTargetAmount.eq(MAX_DISTRIBUTION_LIMIT)) return 'infinite'
    return 'specific'
  }, [fundingTargetAmount])
}
