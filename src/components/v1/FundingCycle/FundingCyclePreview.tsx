import FundingCycleDetailsCard from 'components/shared/Project/FundingCycleDetailsCard'
import { V1FundingCycle } from 'models/v1/fundingCycle'

import { fundingCycleRiskCount, isRecurring } from 'utils/v1/fundingCycle'

import FundingCycleDetails from './FundingCycleDetails'

export default function FundingCyclePreview({
  fundingCycle,
  showDetail,
}: {
  fundingCycle: V1FundingCycle | undefined
  showDetail?: boolean
}) {
  if (!fundingCycle) return null

  return (
    <FundingCycleDetailsCard
      fundingCycleDetails={<FundingCycleDetails fundingCycle={fundingCycle} />}
      fundingCycleDuration={fundingCycle.duration}
      fundingCycleNumber={fundingCycle.number}
      fundingCycleStartTime={fundingCycle.start}
      isFundingCycleRecurring={isRecurring(fundingCycle)}
      fundingCycleRiskCount={fundingCycleRiskCount(fundingCycle)}
      showDetail={showDetail}
    />
  )
}
