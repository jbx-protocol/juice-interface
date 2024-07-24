import { JBSplit, SplitPortion } from 'juice-sdk-core'
import {
  useJBContractContext,
  useJBRuleset,
  useReadJbSplitsSplitsOf,
} from 'juice-sdk-react'

const RESERVED_SPLITS_GROUP_ID = 1n

export const useV4ReservedSplits = () => {
  const { projectId } = useJBContractContext()
  const { data: ruleset } = useJBRuleset()

  const { data: _splits, isLoading: currentSplitsLoading } =
    useReadJbSplitsSplitsOf({
      args: [projectId, BigInt(ruleset?.id ?? 0), RESERVED_SPLITS_GROUP_ID],
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
