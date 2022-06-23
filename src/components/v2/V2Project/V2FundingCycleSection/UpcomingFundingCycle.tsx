import { CardSection } from 'components/shared/CardSection'
import FundingCycleDetailsCard from 'components/shared/Project/FundingCycleDetailsCard'
import { LoadingOutlined } from '@ant-design/icons'
import { V2ProjectContext } from 'contexts/v2/projectContext'
import { useContext } from 'react'
import { V2FundingCycleRiskCount } from 'utils/v2/fundingCycle'
import useProjectDistributionLimit from 'hooks/v2/contractReader/ProjectDistributionLimit'
import { useProjectLatestConfiguredFundingCycle } from 'hooks/v2/contractReader/ProjectLatestConfiguredFundingCycle'
import useProjectSplits from 'hooks/v2/contractReader/ProjectSplits'
import useProjectQueuedFundingCycle from 'hooks/v2/contractReader/ProjectQueuedFundingCycle'
import {
  BallotState,
  V2FundingCycle,
  V2FundingCycleMetadata,
} from 'models/v2/fundingCycle'

import FundingCycleDetails from './FundingCycleDetails'
import PayoutSplitsCard from './PayoutSplitsCard'
import ReservedTokensSplitsCard from './ReservedTokensSplitsCard'

import {
  ETH_PAYOUT_SPLIT_GROUP,
  RESERVED_TOKEN_SPLIT_GROUP,
} from 'constants/v2/splits'

const useUpcomingFundingCycle = (): [
  V2FundingCycle | undefined,
  V2FundingCycleMetadata | undefined,
  BallotState?,
] => {
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

  if (isCurrentFundingCycleLatest && queuedFundingCycle) {
    return [queuedFundingCycle, queuedFundingCycleMetadata]
  }

  return [
    latestConfiguredFundingCycle,
    latestConfiguredFundingCycleMetadata,
    latestConfiguredFundingCycleBallotState,
  ]
}

export default function UpcomingFundingCycle({
  expandCard,
}: {
  expandCard?: boolean
}) {
  const { projectId, primaryTerminal } = useContext(V2ProjectContext)

  const [upcomingFundingCycle, upcomingFundingCycleMetadata, ballotState] =
    useUpcomingFundingCycle()

  const { data: queuedPayoutSplits } = useProjectSplits({
    projectId,
    splitGroup: ETH_PAYOUT_SPLIT_GROUP,
    domain: upcomingFundingCycle?.configuration?.toString(),
  })

  const { data: queuedReservedTokensSplits } = useProjectSplits({
    projectId,
    splitGroup: RESERVED_TOKEN_SPLIT_GROUP,
    domain: upcomingFundingCycle?.configuration?.toString(),
  })

  const { data: queuedDistributionLimitData } = useProjectDistributionLimit({
    projectId,
    configuration: upcomingFundingCycle?.configuration.toString(),
    terminal: primaryTerminal,
  })
  const [queuedDistributionLimit, queuedDistributionLimitCurrency] =
    queuedDistributionLimitData ?? []

  if (!upcomingFundingCycle) return <LoadingOutlined />

  const queuedReservedRate = upcomingFundingCycleMetadata?.reservedRate

  return (
    <div>
      <CardSection>
        <FundingCycleDetailsCard
          fundingCycleNumber={upcomingFundingCycle.number}
          fundingCycleDetails={
            <FundingCycleDetails
              fundingCycle={upcomingFundingCycle}
              fundingCycleMetadata={upcomingFundingCycleMetadata}
              distributionLimit={queuedDistributionLimit}
              distributionLimitCurrency={queuedDistributionLimitCurrency}
            />
          }
          fundingCycleDurationSeconds={upcomingFundingCycle.duration}
          fundingCycleStartTime={upcomingFundingCycle.start}
          isFundingCycleRecurring
          fundingCycleRiskCount={V2FundingCycleRiskCount(upcomingFundingCycle)}
          expand={expandCard}
          ballotState={ballotState}
        />
      </CardSection>

      <PayoutSplitsCard
        payoutSplits={queuedPayoutSplits}
        distributionLimitCurrency={queuedDistributionLimitCurrency}
        distributionLimit={queuedDistributionLimit}
        fundingCycleDuration={upcomingFundingCycle.duration}
        hideDistributeButton
      />
      <ReservedTokensSplitsCard
        reservedTokensSplits={queuedReservedTokensSplits}
        reservedRate={queuedReservedRate}
        hideDistributeButton
      />
    </div>
  )
}
