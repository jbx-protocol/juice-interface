import FundingCycleDetailsCard from 'components/shared/Project/FundingCycleDetailsCard'

import { V1FundingCycle } from 'models/v1/fundingCycle'

import { fundingCycleRiskCount, isRecurring } from 'utils/v1/fundingCycle'

import { SECONDS_IN_DAY } from 'constants/numbers'

import FundingCycleDetails from './FundingCycleDetails'

export default function FundingCyclePreview({
  fundingCycle,
  expand,
}: {
  fundingCycle: V1FundingCycle | undefined
  expand?: boolean
}) {
  if (!fundingCycle) return null

  return (
    <FundingCycleDetailsCard
      fundingCycleDetails={<FundingCycleDetails fundingCycle={fundingCycle} />}
      fundingCycleDurationSeconds={fundingCycle.duration.mul(SECONDS_IN_DAY)}
      fundingCycleNumber={fundingCycle.number}
      fundingCycleStartTime={fundingCycle.start}
      isFundingCycleRecurring={isRecurring(fundingCycle)}
      fundingCycleRiskCount={fundingCycleRiskCount(fundingCycle)}
      expand={expand}
    />
  )
}
