import { V3ProjectContext } from 'contexts/v3/projectContext'
import {
  BallotState,
  V3FundingCycle,
  V3FundingCycleMetadata,
} from 'models/v3/fundingCycle'
import { useContext } from 'react'
import { useProjectLatestConfiguredFundingCycle } from './ProjectLatestConfiguredFundingCycle'
import useProjectQueuedFundingCycle from './ProjectQueuedFundingCycle'

/**
 * If the latestConfiguredFundingCycleOf has an active ballot, return latestConfiguredFundingCycleOf.
 * Else, return queuedFundingCycleOf.
 */
export function useProjectUpcomingFundingCycle(): [
  V3FundingCycle | undefined,
  V3FundingCycleMetadata | undefined,
  BallotState?,
] {
  const { projectId } = useContext(V3ProjectContext)

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
