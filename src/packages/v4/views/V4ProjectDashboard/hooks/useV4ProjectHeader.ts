import { SubtitleType, useSubtitle } from 'hooks/useSubtitle'
import {
  useJBContractContext,
  useJBProjectMetadataContext,
} from 'juice-sdk-react'

import { BigNumber } from '@ethersproject/bignumber'
import { useGnosisSafe } from 'hooks/safe/useGnosisSafe'
import { useProjectTrendingPercentageIncrease } from 'hooks/useProjectTrendingPercentageIncrease'
import { GnosisSafe } from 'models/safe'
import { ProjectsDocument } from 'packages/v4/graphql/client/graphql'
import { useOmnichainSubgraphQuery } from 'packages/v4/graphql/useOmnichainSubgraphQuery'
import { useSubgraphQuery } from 'packages/v4/graphql/useSubgraphQuery'
import useV4ProjectOwnerOf from 'packages/v4/hooks/useV4ProjectOwnerOf'
import React from 'react'

export interface ProjectHeaderData {
  title: string | undefined
  subtitle: { text: string; type: SubtitleType } | undefined
  projectId: number | undefined
  owner: string | undefined
  payments: number | undefined
  totalVolume: bigint | undefined
  last7DaysPercent: number
  gnosisSafe: GnosisSafe | undefined | null
  archived: boolean | undefined
  createdAtSeconds: number | undefined
}

export const useV4ProjectHeader = (): ProjectHeaderData => {
  const { projectId } = useJBContractContext()
  const { metadata } = useJBProjectMetadataContext()
  const projectMetadata = metadata?.data

  const { data: projectOwnerAddress } = useV4ProjectOwnerOf()

  const projectIdNum = parseInt(projectId.toString())

  const { data } = useSubgraphQuery({
    document: ProjectsDocument,
    variables: {
      where: {
        projectId: projectIdNum,
      },
    },
  })
  const projectStatsData = data?.projects?.[0]

  const omnichainProjects = useOmnichainSubgraphQuery(ProjectsDocument, {
    where: {
      projectId: projectIdNum,
    },
  })

  const paymentsCount = React.useMemo(() => {
    if (omnichainProjects?.isLoading || !omnichainProjects?.data) {
      // Fallback to the local chain as subgraph omnichain call can take a while
      return projectStatsData?.paymentsCount ?? 0
    }
    return omnichainProjects?.data.reduce((acc, result) => {
      return acc + (result.value.response.projects[0]?.paymentsCount ?? 0)
    }, 0)
  }, [
    omnichainProjects?.data,
    omnichainProjects?.isLoading,
    projectStatsData?.paymentsCount,
  ])

  const createdAt = projectStatsData?.createdAt

  const totalVolume = React.useMemo(() => {
    if (omnichainProjects?.isLoading || !omnichainProjects?.data) {
      return projectStatsData?.volume ?? 0n
    }
    return omnichainProjects?.data.reduce((acc, result) => {
      return acc + BigInt(result.value.response.projects[0]?.volume ?? 0)
    }, 0n)
  }, [
    omnichainProjects?.data,
    omnichainProjects?.isLoading,
    projectStatsData?.volume,
  ])

  const trendingVolume = React.useMemo(() => {
    if (omnichainProjects?.isLoading || !omnichainProjects?.data) {
      return projectStatsData?.trendingVolume ?? 0n
    }
    return omnichainProjects?.data.reduce((acc, result) => {
      return (
        acc + BigInt(result.value.response.projects[0]?.trendingVolume ?? 0)
      )
    }, 0n)
  }, [
    omnichainProjects?.data,
    omnichainProjects?.isLoading,
    projectStatsData?.trendingVolume,
  ])

  const last7DaysPercent = useProjectTrendingPercentageIncrease({
    totalVolume: BigNumber.from(totalVolume ?? 0),
    trendingVolume: BigNumber.from(trendingVolume ?? 0),
  })

  const { data: gnosisSafe } = useGnosisSafe(projectOwnerAddress)

  const subtitle = useSubtitle(projectMetadata ?? undefined)

  return {
    title: projectMetadata?.name,
    subtitle,
    projectId: projectIdNum,
    owner: projectOwnerAddress,
    payments: paymentsCount,
    totalVolume,
    last7DaysPercent,
    gnosisSafe,
    archived: projectMetadata?.archived,
    createdAtSeconds: createdAt,
  }
}
