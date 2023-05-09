import {
  BallotState,
  V2V3FundingCycle,
  V2V3FundingCycleMetadata,
} from 'models/v2v3/fundingCycle'
import { useProjectLatestConfiguredFundingCycle } from './useProjectLatestConfiguredFundingCycle'
import useProjectQueuedFundingCycle from './useProjectQueuedFundingCycle'
import { ContractReadResult } from './useV2ContractReader'

type UpcomingFundingCycleDataType = [
  V2V3FundingCycle | undefined,
  V2V3FundingCycleMetadata | undefined,
  BallotState?,
]

/**
 * If the latestConfiguredFundingCycleOf has an active ballot, return latestConfiguredFundingCycleOf.
 * Else, return queuedFundingCycleOf.
 */
export function useProjectUpcomingFundingCycle({
  projectId,
}: {
  projectId: number | undefined
}): ContractReadResult<UpcomingFundingCycleDataType> {
  /**
   * Get Latest Configured Funding Cycle.
   */
  const {
    data: latestConfiguredFundingCycleResponse,
    loading: latestConfiguredFundingCycleLoading,
    refetchValue,
  } = useProjectLatestConfiguredFundingCycle({
    projectId,
  })
  const [
    latestConfiguredFundingCycle,
    latestConfiguredFundingCycleMetadata,
    latestConfiguredFundingCycleBallotState,
  ] = latestConfiguredFundingCycleResponse ?? []
  const isLatestConfiguredActive =
    latestConfiguredFundingCycle &&
    latestConfiguredFundingCycleBallotState === BallotState.active

  /**
   * Get Queued Configured Funding Cycle, only if latestConfiguredFundingCycle isn't active.
   */
  const {
    data: queuedFundingCycleResponse,
    loading: queuedFundingCycleLoading,
  } = useProjectQueuedFundingCycle({
    projectId: !isLatestConfiguredActive ? projectId : undefined,
  })
  const [queuedFundingCycle, queuedFundingCycleMetadata] =
    queuedFundingCycleResponse ?? []

  const loading =
    queuedFundingCycleLoading || latestConfiguredFundingCycleLoading

  if (isLatestConfiguredActive) {
    return {
      data: [
        latestConfiguredFundingCycle,
        latestConfiguredFundingCycleMetadata,
        latestConfiguredFundingCycleBallotState,
      ],
      loading,
      refetchValue,
    }
  }

  return {
    data: [queuedFundingCycle, queuedFundingCycleMetadata],
    loading,
    refetchValue,
  }
}
