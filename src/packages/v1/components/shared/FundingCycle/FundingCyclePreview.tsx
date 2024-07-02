import FundingCycleDetailsCard from 'components/Project/FundingCycleDetailsCard'
import { SECONDS_IN_DAY } from 'constants/numbers'
import { V1FundingCycle } from 'packages/v1/models/fundingCycle'
import {
  fundingCycleRiskCount,
  isRecurring,
} from 'packages/v1/utils/fundingCycle'
import FundingCycleDetails from './FundingCycleDetails'

export default function FundingCyclePreview({
  fundingCycle,
}: {
  fundingCycle: V1FundingCycle | undefined
}) {
  if (!fundingCycle) return null

  return (
    <FundingCycleDetailsCard
      fundingCycleDetails={<FundingCycleDetails fundingCycle={fundingCycle} />}
      fundingCycleDurationSeconds={fundingCycle.duration * SECONDS_IN_DAY}
      fundingCycleNumber={fundingCycle.number}
      fundingCycleStartTime={fundingCycle.start}
      isFundingCycleRecurring={isRecurring(fundingCycle)}
      fundingCycleRiskCount={fundingCycleRiskCount(fundingCycle)}
    />
  )
}
