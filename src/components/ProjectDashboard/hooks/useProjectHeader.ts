import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import { BigNumber } from 'ethers'
import { useProjectTrendingPercentageIncrease } from 'hooks/useProjects'
import { useContext } from 'react'
import { useProjectMetadata } from './useProjectMetadata'

export interface ProjectHeaderData {
  title: string | undefined
  subtitle: string | undefined
  handle: string | undefined
  projectId: number | undefined
  owner: string | undefined
  payments: number | undefined
  totalVolume: BigNumber | undefined
  last7DaysPercent: number
}

export const useProjectHeader = (): ProjectHeaderData => {
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
