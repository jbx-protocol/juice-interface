import {
  JBSplit,
  NATIVE_TOKEN,
  SplitPortion
} from 'juice-sdk-core'
import {
  JBChainId,
  useReadJbSplitsSplitsOf,
  useReadJbTokensTokenOf
} from 'juice-sdk-react'

import { useJBUpcomingRuleset } from './useJBUpcomingRuleset'
import { useProjectIdOfChain } from './useProjectIdOfChain'

export const useV4UpcomingPayoutSplits = (chainId?: JBChainId) => {
  const projectIdOfChainId = useProjectIdOfChain({ chainId })

  const { ruleset: upcomingRuleset, isLoading: upcomingRulesetLoading } =
    useJBUpcomingRuleset(chainId)
  const { data: tokenAddress } = useReadJbTokensTokenOf()
  const groupId = BigInt(tokenAddress ?? NATIVE_TOKEN) // contracts say this is: `uint256(uint160(tokenAddress))`

  const { data, isLoading } = useReadJbSplitsSplitsOf({
    args: [
      BigInt(projectIdOfChainId ?? 0),
      BigInt(upcomingRuleset?.id ?? 0),
      groupId,
    ],
    query: {
      select(data) {
        return data.map(d => ({
          ...d,
          percent: new SplitPortion(d.percent),
        }))
      },
    },
    chainId
  }) as { data: JBSplit[], isLoading: boolean }

  if (upcomingRulesetLoading) {
    return { data: undefined, isLoading: true }
  }

  if (!projectIdOfChainId) return { data: undefined, isLoading: false}


  return { data, isLoading }
}
