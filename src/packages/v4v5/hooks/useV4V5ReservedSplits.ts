import { JBChainId, JBSplit, SplitPortion, jbSplitsAbi, JBCoreContracts, jbContractAddress } from 'juice-sdk-core'
import {
  useJBProjectId,
  useJBRuleset,
  useJBUpcomingRuleset,
} from 'juice-sdk-react'
import { useReadContract } from 'wagmi'
import { useV4V5Version } from '../contexts/V4V5VersionProvider'
const RESERVED_SPLITS_GROUP_ID = 1n
export const useV4V5ReservedSplits = (chainId?: JBChainId) => {
  const { projectId } = useJBProjectId(chainId)
  const { version } = useV4V5Version()
  const versionString = version.toString() as '4' | '5'
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
  const { data: _splits, isLoading: currentSplitsLoading } = useReadContract({
    abi: jbSplitsAbi,
    address: jbContractAddress[versionString][JBCoreContracts.JBSplits][chainId ?? 1],
    functionName: 'splitsOf',
    args: [
      BigInt(projectId ?? 0),
      BigInt(_ruleset?.id ?? 0),
      RESERVED_SPLITS_GROUP_ID,
    ],
    query: {
      select(data) {
        return data?.map((d) => ({
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
