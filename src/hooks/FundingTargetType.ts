import { BigNumber } from '@ethersproject/bignumber'
import { FundingTargetType } from 'models/fundingTargetType'
import { useMemo } from 'react'
import { MAX_DISTRIBUTION_LIMIT } from 'utils/v2v3/math'

export const useFundingTargetType = (
  fundingTargetAmount: BigNumber | undefined,
): FundingTargetType => {
  return useMemo(() => {
    if (!fundingTargetAmount) return 'none'
    if (fundingTargetAmount.eq(MAX_DISTRIBUTION_LIMIT)) return 'infinite'
    if (fundingTargetAmount.eq(0)) return 'none'
    return 'specific'
  }, [fundingTargetAmount])
}
