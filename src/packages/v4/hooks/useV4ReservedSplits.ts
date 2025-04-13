import { JBChainId, JBSplit, SplitPortion } from 'juice-sdk-core'
import {
  useJBProjectId,
  useJBRuleset,
  useReadJbSplitsSplitsOf,
} from 'juice-sdk-react'
const RESERVED_SPLITS_GROUP_ID = 1n
export const useV4ReservedSplits = (chainId?: JBChainId) => {
  const { projectId } = useJBProjectId(chainId)
  const { ruleset } = useJBRuleset({
    projectId,
    chainId,
  })
  const { data: _splits, isLoading: currentSplitsLoading } =
    useReadJbSplitsSplitsOf({
      args: [
        BigInt(projectId ?? 0),
        BigInt(ruleset?.id ?? 0),
        RESERVED_SPLITS_GROUP_ID,
      ],
      query: {
        select(data) {
          return data.map(d => ({
            ...d,
            percent: new SplitPortion(d.percent),
          }))
        },
      },
      chainId,
    })

  const splits: JBSplit[] = _splits ? [..._splits] : []

  return { splits, isLoading: currentSplitsLoading }
}
