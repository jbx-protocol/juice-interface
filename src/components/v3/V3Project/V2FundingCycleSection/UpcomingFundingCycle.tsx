import { CardSection } from 'components/CardSection'
import Loading from 'components/Loading'
import FundingCycleDetailsCard from 'components/Project/FundingCycleDetailsCard'
import {
  ETH_PAYOUT_SPLIT_GROUP,
  RESERVED_TOKEN_SPLIT_GROUP,
} from 'constants/splits'
import { V3ProjectContext } from 'contexts/v3/projectContext'
import useProjectDistributionLimit from 'hooks/v3/contractReader/ProjectDistributionLimit'
import useProjectSplits from 'hooks/v3/contractReader/ProjectSplits'
import { useProjectUpcomingFundingCycle } from 'hooks/v3/contractReader/ProjectUpcomingFundingCycle'
import { useContext } from 'react'
import { V3FundingCycleRiskCount } from 'utils/v3/fundingCycle'
import FundingCycleDetails from './FundingCycleDetails'
import PayoutSplitsCard from './PayoutSplitsCard'
import ReservedTokensSplitsCard from './ReservedTokensSplitsCard'

export default function UpcomingFundingCycle({
  expandCard,
}: {
  expandCard?: boolean
}) {
  const { projectId, primaryTerminal } = useContext(V3ProjectContext)

  const [upcomingFundingCycle, upcomingFundingCycleMetadata, ballotState] =
    useProjectUpcomingFundingCycle()

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

  if (!upcomingFundingCycle) return <Loading />

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
          fundingCycleRiskCount={V3FundingCycleRiskCount(upcomingFundingCycle)}
          expand={expandCard}
          ballotState={ballotState}
          ballotStrategyAddress={upcomingFundingCycle.ballot}
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
