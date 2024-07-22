import { JBSplit, SplitPortion } from 'juice-sdk-core'
import {
  useJBContractContext,
  useReadJbSplitsSplitsOf,
  useReadJbTokensTokenOf,
} from 'juice-sdk-react'
import { useJBUpcomingRuleset } from 'packages/v4/hooks/useJBUpcomingRuleset'
import { useV4CurrentPayoutSplits } from '../../../../../hooks/useV4PayoutSplits'

export const useV4CurrentUpcomingPayoutSplits = (
  type: 'current' | 'upcoming',
) => {
  const { projectId } = useJBContractContext()
  const { data: tokenAddress } = useReadJbTokensTokenOf()
  const { splits, isLoading: currentSplitsLoading } = useV4CurrentPayoutSplits()

  const { ruleset: upcomingRuleset, isLoading: upcomingRulesetLoading } =
    useJBUpcomingRuleset()

  const { data: _upcomingSplits, isLoading: upcomingSplitsLoading } =
    useReadJbSplitsSplitsOf({
      args: [
        projectId,
        BigInt(upcomingRuleset?.id ?? 0),
        BigInt(tokenAddress ?? 0),
      ],
      query: {
        select(data) {
          return data.map(d => ({
            ...d,
            percent: new SplitPortion(d.percent),
          }))
        },
      },
    })

  const upcomingSplits: JBSplit[] = _upcomingSplits ? [..._upcomingSplits] : []

  if (type === 'current') {
    return { splits, isLoading: currentSplitsLoading }
  }
  return {
    splits: upcomingSplits,
    isLoading: upcomingSplitsLoading || upcomingRulesetLoading,
  }
}
