import { JBSplit, SplitPortion } from 'juice-sdk-core'
import {
  useJBContractContext,
  useJBRuleset,
  useReadJbSplitsSplitsOf,
  useReadJbTokensTokenOf,
} from 'juice-sdk-react'

export const useV4CurrentPayoutSplits = () => {
  const { projectId } = useJBContractContext()
  const { data: tokenAddress } = useReadJbTokensTokenOf()
  const { data: ruleset } = useJBRuleset()

  const groupId = BigInt(tokenAddress ?? 0) // contracts say this is: `uint256(uint160(tokenAddress))`
  const { data: _splits, isLoading: currentSplitsLoading } =
    useReadJbSplitsSplitsOf({
      args: [projectId, BigInt(ruleset?.id ?? 0), groupId],
      query: {
        select(data) {
          return data.map(d => ({
            ...d,
            percent: new SplitPortion(d.percent),
          }))
        },
      },
    })

  const splits: JBSplit[] = _splits ? [..._splits] : []

  return { splits, isLoading: currentSplitsLoading }
}
