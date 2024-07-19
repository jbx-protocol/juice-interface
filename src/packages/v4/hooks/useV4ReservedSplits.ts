import { useJBContractContext, useJBRuleset, useReadJbSplitsSplitsOf } from 'juice-sdk-react'
import { V4Split } from 'packages/v4/models/v4Split'

const RESERVED_SPLITS_GROUP_ID = 1n

export const useV4ReservedSplits = () => {
  const { projectId } = useJBContractContext()
  const { data: ruleset } = useJBRuleset()

  const { data: _splits, isLoading: currentSplitsLoading } = useReadJbSplitsSplitsOf({
    args: [
      projectId, 
      ruleset?.id ?? 0n, 
      RESERVED_SPLITS_GROUP_ID
    ],
  })

  const splits: V4Split[] = _splits ? [..._splits] : []

  return { splits, isLoading: currentSplitsLoading }
}
