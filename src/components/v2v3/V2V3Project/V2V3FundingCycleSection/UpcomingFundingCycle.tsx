import { Trans } from '@lingui/macro'
import { CardSection } from 'components/CardSection'
import Loading from 'components/Loading'
import FundingCycleDetailsCard from 'components/Project/FundingCycleDetailsCard'
import {
  ETH_PAYOUT_SPLIT_GROUP,
  RESERVED_TOKEN_SPLIT_GROUP,
} from 'constants/splits'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import useProjectDistributionLimit from 'hooks/v2v3/contractReader/useProjectDistributionLimit'
import useProjectSplits from 'hooks/v2v3/contractReader/useProjectSplits'
import { useProjectUpcomingFundingCycle } from 'hooks/v2v3/contractReader/useProjectUpcomingFundingCycle'
import { useContext } from 'react'
import { getV2V3FundingCycleRiskCount } from 'utils/v2v3/fundingCycle'
import FundingCycleDetails from './FundingCycleDetails'
import PayoutSplitsCard from './PayoutSplitsCard'
import ReservedTokensSplitsCard from './ReservedTokensSplitsCard'

export function UpcomingFundingCycle() {
  const { primaryETHTerminal } = useContext(V2V3ProjectContext)
  const { projectId } = useContext(ProjectMetadataContext)

  const { data: upcomingFundingCycleResponse, loading } =
    useProjectUpcomingFundingCycle({ projectId })
  const [upcomingFundingCycle, upcomingFundingCycleMetadata, ballotState] =
    upcomingFundingCycleResponse ?? []

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
    terminal: primaryETHTerminal,
  })
  const [queuedDistributionLimit, queuedDistributionLimitCurrency] =
    queuedDistributionLimitData ?? []

  if (loading) return <Loading />

  if (!upcomingFundingCycle || !upcomingFundingCycleMetadata) {
    return (
      <CardSection>
        <Trans>No upcoming cycle.</Trans>
      </CardSection>
    )
  }

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
          fundingCycleRiskCount={getV2V3FundingCycleRiskCount(
            upcomingFundingCycle,
            upcomingFundingCycleMetadata,
          )}
          ballotState={ballotState}
          ballotStrategyAddress={upcomingFundingCycle.ballot}
        />
      </CardSection>

      <PayoutSplitsCard
        payoutSplits={queuedPayoutSplits}
        distributionLimitCurrency={queuedDistributionLimitCurrency}
        distributionLimit={queuedDistributionLimit}
        hideDistributeButton
      />
      <ReservedTokensSplitsCard
        reservedTokensSplits={queuedReservedTokensSplits}
        reservedRate={upcomingFundingCycleMetadata.reservedRate}
        hideDistributeButton
      />
    </div>
  )
}
