import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import {
  BallotState,
  V2FundingCycleMetadata,
  V2V3FundingCycle,
} from 'models/v2/fundingCycle'
import { useContext } from 'react'
import { useProjectLatestConfiguredFundingCycle } from './ProjectLatestConfiguredFundingCycle'
import useProjectQueuedFundingCycle from './ProjectQueuedFundingCycle'

/**
 * If the latestConfiguredFundingCycleOf has an active ballot, return latestConfiguredFundingCycleOf.
 * Else, return queuedFundingCycleOf.
 */
export function useProjectUpcomingFundingCycle(): [
  V2V3FundingCycle | undefined,
  V2FundingCycleMetadata | undefined,
  BallotState?,
] {
  const { projectId } = useContext(ProjectMetadataContext)

  const { data: latestConfiguredFundingCycleResponse } =
    useProjectLatestConfiguredFundingCycle({
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

  const { data: queuedFundingCycleResponse } = useProjectQueuedFundingCycle({
    projectId: !isLatestConfiguredActive ? projectId : undefined,
  })
  const [queuedFundingCycle, queuedFundingCycleMetadata] =
    queuedFundingCycleResponse ?? []

  if (isLatestConfiguredActive) {
    return [
      latestConfiguredFundingCycle,
      latestConfiguredFundingCycleMetadata,
      latestConfiguredFundingCycleBallotState,
    ]
  }

  return [queuedFundingCycle, queuedFundingCycleMetadata]
}
