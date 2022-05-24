import { CardSection } from 'components/shared/CardSection'
import FundingCycleDetailsCard from 'components/shared/Project/FundingCycleDetailsCard'
import { LoadingOutlined } from '@ant-design/icons'
import { V2ProjectContext } from 'contexts/v2/projectContext'
import { useContext } from 'react'
import { V2FundingCycleRiskCount } from 'utils/v2/fundingCycle'

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

  if (!fundingCycle) return <LoadingOutlined />

  const reservedRate = fundingCycleMetadata?.reservedRate

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
          fundingCycleRiskCount={V2FundingCycleRiskCount(fundingCycle)}
          expand={expandCard}
        />
      </CardSection>

      <PayoutSplitsCard
        payoutSplits={payoutSplits}
        distributionLimitCurrency={distributionLimitCurrency}
        distributionLimit={distributionLimit}
      />
      <ReservedTokensSplitsCard
        reservedTokensSplits={reservedTokensSplits}
        reservedRate={reservedRate}
      />
    </div>
  )
}
