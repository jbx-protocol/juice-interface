import { CardSection } from 'components/shared/CardSection'
import FundingCycleDetailsCard from 'components/shared/Project/FundingCycleDetailsCard'
import { LoadingOutlined } from '@ant-design/icons'
import { V2ProjectContext } from 'contexts/v2/projectContext'
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
  const {
    queuedFundingCycle,
    queuedPayoutSplits,
    queuedDistributionLimitCurrency,
    queuedDistributionLimit,
    queuedReservedTokensSplits,
    queuedFundingCycleMetadata,
  } = useContext(V2ProjectContext)

  if (!queuedFundingCycle) return <LoadingOutlined />

  const queuedReservedRate = queuedFundingCycleMetadata?.reservedRate

  return (
    <div>
      <CardSection>
        <FundingCycleDetailsCard
          fundingCycleNumber={queuedFundingCycle.number}
          fundingCycleDetails={
            <FundingCycleDetails fundingCycle={queuedFundingCycle} />
          }
          fundingCycleDurationSeconds={queuedFundingCycle.duration}
          fundingCycleStartTime={queuedFundingCycle.start}
          isFundingCycleRecurring={true}
          fundingCycleRiskCount={V2FundingCycleRiskCount(queuedFundingCycle)}
          expand={expandCard}
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
        reservedRate={queuedReservedRate}
        hideDistributeButton
      />
    </div>
  )
}
