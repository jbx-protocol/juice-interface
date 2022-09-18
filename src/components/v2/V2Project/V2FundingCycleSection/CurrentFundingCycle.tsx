import { LoadingOutlined } from '@ant-design/icons'
import { CardSection } from 'components/CardSection'
import FundingCycleDetailsCard from 'components/Project/FundingCycleDetailsCard'
import { V2ProjectContext } from 'contexts/v2/projectContext'
import { useContext } from 'react'
import { v2FundingCycleRiskCount } from 'utils/v2/fundingCycle'

import FundingCycleDetails from './FundingCycleDetails'
import PayoutSplitsCard from './PayoutSplitsCard'
import ReservedTokensSplitsCard from './ReservedTokensSplitsCard'

export default function CurrentFundingCycle({
  expandCard,
}: {
  expandCard?: boolean
}) {
  const {
    fundingCycle,
    payoutSplits,
    distributionLimitCurrency,
    distributionLimit,
    reservedTokensSplits,
    fundingCycleMetadata,
  } = useContext(V2ProjectContext)

  if (!fundingCycle || !fundingCycleMetadata) return <LoadingOutlined />

  return (
    <div>
      <CardSection>
        <FundingCycleDetailsCard
          fundingCycleNumber={fundingCycle.number}
          fundingCycleDetails={
            <FundingCycleDetails
              fundingCycle={fundingCycle}
              fundingCycleMetadata={fundingCycleMetadata}
              distributionLimit={distributionLimit}
              distributionLimitCurrency={distributionLimitCurrency}
            />
          }
          fundingCycleDurationSeconds={fundingCycle.duration}
          fundingCycleStartTime={fundingCycle.start}
          isFundingCycleRecurring={true}
          fundingCycleRiskCount={v2FundingCycleRiskCount(
            fundingCycle,
            fundingCycleMetadata,
          )}
          expand={expandCard}
        />
      </CardSection>

      <PayoutSplitsCard
        payoutSplits={payoutSplits}
        distributionLimitCurrency={distributionLimitCurrency}
        distributionLimit={distributionLimit}
        fundingCycleDuration={fundingCycle.duration}
      />
      <ReservedTokensSplitsCard
        reservedTokensSplits={reservedTokensSplits}
        reservedRate={fundingCycleMetadata.reservedRate}
      />
    </div>
  )
}
