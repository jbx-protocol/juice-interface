import FundingCycleDetailsCard from 'components/Project/FundingCycleDetailsCard'

import { V1FundingCycle } from 'models/v1/fundingCycle'

import { fundingCycleRiskCount, isRecurring } from 'utils/v1/fundingCycle'

import { SECONDS_IN_DAY } from 'constants/numbers'

import { V1ProjectContext } from 'contexts/v1/projectContext'
import { useContext } from 'react'
import FundingCycleDetails from './FundingCycleDetails'

export default function FundingCyclePreview({
  fundingCycle,
}: {
  fundingCycle: V1FundingCycle | undefined
}) {
  const { isPreviewMode } = useContext(V1ProjectContext)

  if (!fundingCycle) return null

  return (
    <FundingCycleDetailsCard
      fundingCycleDetails={<FundingCycleDetails fundingCycle={fundingCycle} />}
      fundingCycleDurationSeconds={fundingCycle.duration.mul(SECONDS_IN_DAY)}
      fundingCycleNumber={fundingCycle.number}
      fundingCycleStartTime={fundingCycle.start}
      isFundingCycleRecurring={isRecurring(fundingCycle)}
      fundingCycleRiskCount={fundingCycleRiskCount(fundingCycle)}
      isPreviewMode={isPreviewMode}
    />
  )
}
