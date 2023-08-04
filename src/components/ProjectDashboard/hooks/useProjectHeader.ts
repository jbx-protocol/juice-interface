import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import { BigNumber } from 'ethers'
import { useGnosisSafe } from 'hooks/safe/useGnosisSafe'
import { useProjectTrendingPercentageIncrease } from 'hooks/useProjects'
import { GnosisSafe } from 'models/safe'
import { useContext, useMemo } from 'react'
import { useProjectMetadata } from './useProjectMetadata'

type SubtitleType = 'tagline' | 'description'
export interface ProjectHeaderData {
  title: string | undefined
  subtitle: { text: string; type: SubtitleType } | undefined
  handle: string | undefined
  projectId: number | undefined
  owner: string | undefined
  payments: number | undefined
  totalVolume: BigNumber | undefined
  last7DaysPercent: number
  gnosisSafe: GnosisSafe | undefined | null
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
  const { data: gnosisSafe } = useGnosisSafe(projectOwnerAddress)

  const subtitle = useMemo(() => {
    const tagline = projectMetadata?.projectTagline
    const description = projectMetadata?.description
      ? stripHtmlTags(projectMetadata?.description)
      : undefined

    if (tagline) {
      return {
        text: tagline,
        type: 'tagline' as SubtitleType,
      }
    }

    if (description) {
      return {
        text: description,
        type: 'description' as SubtitleType,
      }
    }
  }, [projectMetadata?.description, projectMetadata?.projectTagline])

  return {
    title: projectMetadata?.name,
    subtitle,
    handle,
    projectId,
    owner: projectOwnerAddress,
    payments: paymentsCount,
    totalVolume,
    last7DaysPercent,
    gnosisSafe,
  }
}

const stripHtmlTags = (html: string): string => {
  return html.replace(/<[^>]*>/g, '')
}
