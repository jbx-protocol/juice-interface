import { useProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import { useGnosisSafe } from 'hooks/safe/useGnosisSafe'
import { useProjectTrendingPercentageIncrease } from 'hooks/useProjects'
import { SubtitleType, useSubtitle } from 'hooks/useSubtitle'
import { GnosisSafe } from 'models/safe'
import { useContext } from 'react'

export interface ProjectHeaderData {
  title: string | undefined
  subtitle: { text: string; type: SubtitleType } | undefined
  domain: string | undefined
  handle: string | undefined
  projectId: number | undefined
  owner: string | undefined
  payments: number | undefined
  totalVolume: bigint | undefined
  last7DaysPercent: number
  gnosisSafe: GnosisSafe | undefined | null
  archived: boolean | undefined
  createdAtSeconds: number | undefined
}

export const useProjectHeader = (): ProjectHeaderData => {
  const { projectMetadata, projectId } = useProjectMetadataContext()
  const {
    handle,
    projectOwnerAddress,
    totalVolume,
    trendingVolume,
    paymentsCount,
    createdAt,
  } = useContext(V2V3ProjectContext)
  const last7DaysPercent = useProjectTrendingPercentageIncrease({
    totalVolume: totalVolume ?? BigInt(0),
    trendingVolume: trendingVolume ?? BigInt(0),
  })
  const { data: gnosisSafe } = useGnosisSafe(projectOwnerAddress)

  const subtitle = useSubtitle(projectMetadata)

  return {
    title: projectMetadata?.name,
    subtitle,
    domain: projectMetadata?.domain,
    handle,
    projectId,
    owner: projectOwnerAddress,
    payments: paymentsCount,
    totalVolume,
    last7DaysPercent,
    gnosisSafe,
    archived: projectMetadata?.archived,
    createdAtSeconds: createdAt,
  }
}
