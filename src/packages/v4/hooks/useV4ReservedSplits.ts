import { JBChainId, JBSplit, SplitPortion } from 'juice-sdk-core'
import {
  useJBProjectId,
  useJBRuleset,
  useJBUpcomingRuleset,
  useReadJbSplitsSplitsOf,
} from 'juice-sdk-react'
const RESERVED_SPLITS_GROUP_ID = 1n
export const useV4ReservedSplits = (chainId?: JBChainId) => {
  const { projectId } = useJBProjectId(chainId)
  const { ruleset } = useJBRuleset({
    projectId,
    chainId,
  })
  const { ruleset: upcomingRuleset } = useJBUpcomingRuleset(
    {
      projectId,
      chainId,
    },
  )
  let _ruleset = ruleset
  if (ruleset?.cycleNumber === 0) {
    _ruleset = upcomingRuleset as typeof ruleset
  }
  const { data: _splits, isLoading: currentSplitsLoading } =
    useReadJbSplitsSplitsOf({
      args: [
        BigInt(projectId ?? 0),
        BigInt(_ruleset?.id ?? 0),
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
