import { useProjectContext } from 'components/v2v3/V2V3Project/ProjectDashboard/hooks/useProjectContext'
import { useMemo } from 'react'
import { MAX_DISTRIBUTION_LIMIT } from 'utils/v2v3/math'

export const useTokenRedemptionCallout = () => {
  const { fundingCycleMetadata, distributionLimit } = useProjectContext()
  fundingCycleMetadata?.redemptionRate
  fundingCycleMetadata?.pauseRedeem

  const redemptionEnabled = useMemo(() => {
    if (!fundingCycleMetadata) return
    return (
      fundingCycleMetadata.redemptionRate > 0n &&
      !fundingCycleMetadata.pauseRedeem &&
      distributionLimit !== MAX_DISTRIBUTION_LIMIT
    )
  }, [distributionLimit, fundingCycleMetadata])

  return { redemptionEnabled }
}
