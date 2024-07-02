import { useProjectContext } from 'packages/v2v3/components/V2V3Project/ProjectDashboard/hooks/useProjectContext'
import { MAX_DISTRIBUTION_LIMIT } from 'packages/v2v3/utils/math'
import { useMemo } from 'react'

export const useTokenRedemptionCallout = () => {
  const { fundingCycleMetadata, distributionLimit } = useProjectContext()
  fundingCycleMetadata?.redemptionRate
  fundingCycleMetadata?.pauseRedeem

  const redemptionEnabled = useMemo(() => {
    if (!fundingCycleMetadata) return
    return (
      fundingCycleMetadata.redemptionRate.gt(0) &&
      !fundingCycleMetadata.pauseRedeem &&
      !distributionLimit?.eq(MAX_DISTRIBUTION_LIMIT)
    )
  }, [distributionLimit, fundingCycleMetadata])

  return { redemptionEnabled }
}
