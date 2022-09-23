import { LoadingOutlined } from '@ant-design/icons'
import { CardSection } from 'components/CardSection'
import FundingCycleDetailsCard from 'components/Project/FundingCycleDetailsCard'
import { V2V3ProjectContext } from 'contexts/v2v3/V2V3ProjectContext'
import { useContext } from 'react'
import { getV2V3FundingCycleRiskCount } from 'utils/v2v3/fundingCycle'

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
  } = useContext(V2V3ProjectContext)

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
          fundingCycleRiskCount={getV2V3FundingCycleRiskCount(
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
