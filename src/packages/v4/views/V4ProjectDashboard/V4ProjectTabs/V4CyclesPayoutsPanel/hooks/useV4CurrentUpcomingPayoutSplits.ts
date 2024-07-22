import { useJBContractContext, useReadJbSplitsSplitsOf, useReadJbTokensTokenOf } from 'juice-sdk-react'
import { useJBUpcomingRuleset } from 'packages/v4/hooks/useJBUpcomingRuleset'
import { V4Split } from 'packages/v4/models/v4Split'
import { useV4CurrentPayoutSplits } from '../../../../../hooks/useV4PayoutSplits'

export const useV4CurrentUpcomingPayoutSplits = (
  type: 'current' | 'upcoming',
) => {
  const { projectId } = useJBContractContext()
  const { data: tokenAddress } = useReadJbTokensTokenOf()
  const { splits, isLoading: currentSplitsLoading } = useV4CurrentPayoutSplits()

  const { ruleset: upcomingRuleset, isLoading: upcomingRulesetLoading } = useJBUpcomingRuleset()


  const { data: _upcomingSplits, isLoading: upcomingSplitsLoading } = useReadJbSplitsSplitsOf({
    args: [
      projectId, 
      upcomingRuleset?.id ?? 0n, 
      BigInt(tokenAddress ?? 0)
    ],
  })

  const upcomingSplits: V4Split[] = _upcomingSplits ? [..._upcomingSplits] : []

  if (type === 'current') {
    return { splits, isLoading: currentSplitsLoading }
  }
  return {
    splits: upcomingSplits,
    isLoading: upcomingSplitsLoading || upcomingRulesetLoading,
  }
}
