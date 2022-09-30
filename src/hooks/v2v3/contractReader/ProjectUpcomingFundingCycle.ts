import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import {
  BallotState,
  V2V3FundingCycle,
  V2V3FundingCycleMetadata,
} from 'models/v2v3/fundingCycle'
import { useContext } from 'react'
import { useProjectLatestConfiguredFundingCycle } from './ProjectLatestConfiguredFundingCycle'
import useProjectQueuedFundingCycle from './ProjectQueuedFundingCycle'
import { ContractReadResult } from './V2ContractReader'

type UpcomingFundingCycleDataType = [
  V2V3FundingCycle | undefined,
  V2V3FundingCycleMetadata | undefined,
  BallotState?,
]

/**
 * If the latestConfiguredFundingCycleOf has an active ballot, return latestConfiguredFundingCycleOf.
 * Else, return queuedFundingCycleOf.
 */
export function useProjectUpcomingFundingCycle(): ContractReadResult<UpcomingFundingCycleDataType> {
  const { projectId } = useContext(ProjectMetadataContext)

  /**
   * Get Latest Configured Funding Cycle.
   */
  const {
    data: latestConfiguredFundingCycleResponse,
    loading: latestConfiguredFundingCycleLoading,
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
    }
  }

  return {
    data: [queuedFundingCycle, queuedFundingCycleMetadata],
    loading,
  }
}
