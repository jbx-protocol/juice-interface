import { V2ProjectContext } from 'contexts/v2/projectContext'
import {
  BallotState,
  V2FundingCycle,
  V2FundingCycleMetadata,
} from 'models/v2/fundingCycle'
import { useContext } from 'react'
import { useProjectLatestConfiguredFundingCycle } from './ProjectLatestConfiguredFundingCycle'
import useProjectQueuedFundingCycle from './ProjectQueuedFundingCycle'

export function useProjectUpcomingFundingCycle(): [
  V2FundingCycle | undefined,
  V2FundingCycleMetadata | undefined,
  BallotState?,
] {
  const { projectId, fundingCycle } = useContext(V2ProjectContext)

  const { data: latestConfiguredFundingCycleResponse } =
    useProjectLatestConfiguredFundingCycle({
      projectId,
    })
  const [
    latestConfiguredFundingCycle,
    latestConfiguredFundingCycleMetadata,
    latestConfiguredFundingCycleBallotState,
  ] = latestConfiguredFundingCycleResponse ?? []

  const isCurrentFundingCycleLatest =
    latestConfiguredFundingCycle &&
    fundingCycle &&
    fundingCycle.number.eq(latestConfiguredFundingCycle.number)

  const { data: queuedFundingCycleResponse } = useProjectQueuedFundingCycle({
    projectId: isCurrentFundingCycleLatest ? projectId : undefined,
  })
  const [queuedFundingCycle, queuedFundingCycleMetadata] =
    queuedFundingCycleResponse ?? []

  const hasLatestBallotFailed =
    latestConfiguredFundingCycleBallotState === BallotState.failed

  if (
    (isCurrentFundingCycleLatest || hasLatestBallotFailed) &&
    queuedFundingCycle
  ) {
    return [queuedFundingCycle, queuedFundingCycleMetadata]
  }

  return [
    latestConfiguredFundingCycle,
    latestConfiguredFundingCycleMetadata,
    latestConfiguredFundingCycleBallotState,
  ]
}
