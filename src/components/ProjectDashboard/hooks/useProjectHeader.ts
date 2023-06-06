import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import { BigNumber } from 'ethers'
import { useProjectTrendingPercentageIncrease } from 'hooks/useProjects'
import { useContext } from 'react'
import { useProjectMetadata } from './useProjectMetadata'

export const useProjectHeader = () => {
  const { projectMetadata, projectId } = useProjectMetadata()
  const {
    handle,
    projectOwnerAddress,
    totalVolume,
    trendingVolume,
    paymentsCount,
  } = useContext(V2V3ProjectContext)
  const last7DaysPercent = useProjectTrendingPercentageIncrease({
    totalVolume: totalVolume ?? BigNumber.from(0),
    trendingVolume: trendingVolume ?? BigNumber.from(0),
  })

  return {
    title: projectMetadata?.name,
    subtitle: projectMetadata?.description, // TODO eventually, metadata subtitle
    handle,
    projectId,
    owner: projectOwnerAddress,
    payments: paymentsCount,
    totalVolume,
    last7DaysPercent,
  }
}
