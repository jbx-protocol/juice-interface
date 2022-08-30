import { LoadingOutlined } from '@ant-design/icons'
import { CardSection } from 'components/CardSection'
import FundingCycleDetailsCard from 'components/Project/FundingCycleDetailsCard'
import {
  ETH_PAYOUT_SPLIT_GROUP,
  RESERVED_TOKEN_SPLIT_GROUP,
} from 'constants/v2/splits'
import { V2ProjectContext } from 'contexts/v2/projectContext'
import useProjectDistributionLimit from 'hooks/v2/contractReader/ProjectDistributionLimit'
import useProjectSplits from 'hooks/v2/contractReader/ProjectSplits'
import { useProjectUpcomingFundingCycle } from 'hooks/v2/contractReader/ProjectUpcomingFundingCycle'
import { useContext } from 'react'
import { V2FundingCycleRiskCount } from 'utils/v2/fundingCycle'
import FundingCycleDetails from './FundingCycleDetails'
import PayoutSplitsCard from './PayoutSplitsCard'
import ReservedTokensSplitsCard from './ReservedTokensSplitsCard'

export default function UpcomingFundingCycle({
  expandCard,
}: {
  expandCard?: boolean
}) {
  const { projectId, primaryTerminal } = useContext(V2ProjectContext)

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
          ballotStrategyAddress={upcomingFundingCycle.ballot}
        />
      </CardSection>

      <PayoutSplitsCard
        payoutSplits={queuedPayoutSplits}
        distributionLimitCurrency={queuedDistributionLimitCurrency}
        distributionLimit={queuedDistributionLimit}
        fundingCycleDuration={upcomingFundingCycle.duration}
        hideDistributeButton
        reservedRate={queuedReservedRate}
      />
      <ReservedTokensSplitsCard
        reservedTokensSplits={queuedReservedTokensSplits}
        reservedRate={queuedReservedRate}
        hideDistributeButton
      />
    </div>
  )
}
