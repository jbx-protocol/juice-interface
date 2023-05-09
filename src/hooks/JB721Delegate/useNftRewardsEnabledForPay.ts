import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import { useContext } from 'react'
import { hasDataSourceForPay } from 'utils/v2v3/fundingCycle'
import { useHasNftRewards } from './useHasNftRewards'

export function useNftRewardsEnabledForPay() {
  const { fundingCycleMetadata } = useContext(V2V3ProjectContext)
  const { value: hasNftRewards } = useHasNftRewards()

  return hasNftRewards && hasDataSourceForPay(fundingCycleMetadata)
}
