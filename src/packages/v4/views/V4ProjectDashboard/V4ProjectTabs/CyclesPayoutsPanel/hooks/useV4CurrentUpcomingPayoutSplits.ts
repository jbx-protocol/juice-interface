import { useJBContractContext, useJBRuleset, useReadJbSplitsSplitsOf, useReadJbTokensTokenOf } from 'juice-sdk-react'
import { useJBUpcomingRuleset } from 'packages/v4/hooks/useJBUpcomingRuleset'
import { V4Split } from 'packages/v4/models/v4Split'

export const useV4CurrentUpcomingPayoutSplits = (
  type: 'current' | 'upcoming',
) => {
  const { projectId } = useJBContractContext()
  const { data: tokenAddress } = useReadJbTokensTokenOf()
  const { data: ruleset } = useJBRuleset()

  const groupId = BigInt(tokenAddress ?? 0) // contracts say this is: `uint256(uint160(tokenAddress))`
  const { ruleset: upcomingRuleset, isLoading: upcomingRulesetLoading } = useJBUpcomingRuleset()
  const { data: _splits, isLoading: currentSplitsLoading } = useReadJbSplitsSplitsOf({
    args: [
      projectId, 
      ruleset?.id ?? 0n, 
      groupId
    ],
  })

  const splits: V4Split[] = _splits ? [..._splits] : []

  const { data: _upcomingSplits, isLoading: upcomingSplitsLoading } = useReadJbSplitsSplitsOf({
    args: [
      projectId, 
      upcomingRuleset?.id ?? 0n, 
      BigInt(tokenAddress ?? 0)
    ],
  })

  const upcomingSplits: V4Split[] = _upcomingSplits ? [..._upcomingSplits] : []

  if (type === 'current') {
    return { splits, loading: currentSplitsLoading }
  }
  return {
    splits: upcomingSplits,
    loading: upcomingSplitsLoading || upcomingRulesetLoading,
  }
}
