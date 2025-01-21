import {
  JBSplit,
  NATIVE_TOKEN,
  SplitPortion
} from 'juice-sdk-core'
import {
  JBChainId,
  useJBRuleset,
  useReadJbSplitsSplitsOf,
  useReadJbTokensTokenOf
} from 'juice-sdk-react'

import { useProjectIdOfChain } from './useProjectIdOfChain'

export const useV4CurrentPayoutSplits = (chainId?: JBChainId) => {
  const projectId = useProjectIdOfChain({ chainId })

  const { data: tokenAddress } = useReadJbTokensTokenOf()
  const { data: ruleset, isLoading: rulesetIsLoading } = useJBRuleset()
  const rulesetId = BigInt(ruleset?.id ?? 0)
  const groupId = BigInt(tokenAddress ?? NATIVE_TOKEN) // contracts say this is: `uint256(uint160(tokenAddress))`

  const { data, isLoading } = useReadJbSplitsSplitsOf({
    args: [BigInt(projectId ?? 0), rulesetId, groupId],
    query: {
      select(data) {
        return data.map(
          (d): JBSplit => ({
            ...d,
            percent: new SplitPortion(d.percent),
          }),
        )
      },
    },
    chainId
  })

  if (rulesetIsLoading) return { data: undefined, isLoading: true}

  return { data, isLoading }
}
