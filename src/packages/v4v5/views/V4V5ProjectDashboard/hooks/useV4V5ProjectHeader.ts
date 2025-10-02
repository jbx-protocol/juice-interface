import { SubtitleType, useSubtitle } from 'hooks/useSubtitle'
import {
  useJBChainId,
  useJBContractContext,
  useJBProjectMetadataContext,
} from 'juice-sdk-react'

import { BigNumber } from '@ethersproject/bignumber'
import { useProjectQuery, useSuckerGroupQuery } from 'generated/v4v5/graphql'
import { useGnosisSafe } from 'hooks/safe/useGnosisSafe'
import { useProjectTrendingPercentageIncrease } from 'hooks/useProjectTrendingPercentageIncrease'
import { bendystrawClient } from 'lib/apollo/bendystrawClient'
import { GnosisSafe } from 'models/safe'
import useV4V5ProjectOwnerOf from 'packages/v4v5/hooks/useV4V5ProjectOwnerOf'
import { useV4V5Version } from 'packages/v4v5/contexts/V4V5VersionProvider'

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

export const useV4V5ProjectHeader = (): ProjectHeaderData => {
  const { projectId } = useJBContractContext()
  const { metadata } = useJBProjectMetadataContext()
  const chainId = useJBChainId()
  const { version } = useV4V5Version()
  const projectMetadata = metadata?.data

  const { data: projectOwnerAddress } = useV4V5ProjectOwnerOf()

  const projectIdNum = parseInt(projectId.toString())

  const { data: project } = useProjectQuery({
    client: bendystrawClient,
    variables: {
      projectId: projectIdNum,
      chainId: Number(chainId),
      version: version
    },
    skip: !projectId || !chainId,
  })

  const { data: suckerGroup } = useSuckerGroupQuery({
    client: bendystrawClient,
    variables: {
      id: project?.project?.suckerGroupId || '',
    },
    skip: !project?.project?.suckerGroupId,
  })

  const sg = suckerGroup?.suckerGroup

  const last7DaysPercent = useProjectTrendingPercentageIncrease({
    totalVolume: BigNumber.from(sg?.volume ?? 0),
    trendingVolume: BigNumber.from(sg?.trendingVolume ?? 0),
  })

  const { data: gnosisSafe } = useGnosisSafe(projectOwnerAddress)

  const subtitle = useSubtitle(projectMetadata ?? undefined)

  return {
    title: projectMetadata?.name,
    subtitle,
    projectId: projectIdNum,
    owner: projectOwnerAddress,
    payments: sg?.paymentsCount,
    totalVolume: sg?.volume,
    last7DaysPercent,
    gnosisSafe,
    archived: projectMetadata?.archived,
    createdAtSeconds: sg?.createdAt,
  }
}
