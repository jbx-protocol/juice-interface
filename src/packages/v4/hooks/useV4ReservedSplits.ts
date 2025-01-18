import { JBChainId, JBSplit, SplitPortion } from 'juice-sdk-core'
import {
  useJBRuleset,
  useReadJbSplitsSplitsOf
} from 'juice-sdk-react'

import { useProjectIdOfChain } from './useProjectIdOfChain'

const RESERVED_SPLITS_GROUP_ID = 1n

export const useV4ReservedSplits = (chainId?: JBChainId) => {
  const projectId = useProjectIdOfChain({ chainId })
  const { data: ruleset } = useJBRuleset()

  const { data: _splits, isLoading: currentSplitsLoading } =
    useReadJbSplitsSplitsOf({
      args: [BigInt(projectId ?? 0), BigInt(ruleset?.id ?? 0), RESERVED_SPLITS_GROUP_ID],
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
