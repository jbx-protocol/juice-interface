import { BigNumber } from 'ethers'
import { useGnosisSafe } from 'hooks/safe/useGnosisSafe'
import { useProjectTrendingPercentageIncrease } from 'hooks/useProjectTrendingPercentageIncrease'
import { SubtitleType, useSubtitle } from 'hooks/useSubtitle'
import {
  useJBContractContext,
  useJBProjectMetadataContext
} from 'juice-sdk-react'
import { GnosisSafe } from 'models/safe'
import { useRouter } from 'next/router'
import { ProjectsDocument } from 'packages/v4/graphql/client/graphql'
import { useSubgraphQuery } from 'packages/v4/graphql/useSubgraphQuery'
import useProjectOwnerOf from 'packages/v4/hooks/useV4ProjectOwnerOf'
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
  chainName: string
}

export const useV4ProjectHeader = (): ProjectHeaderData => {
  const router = useRouter()
  const { projectId } = useJBContractContext()
  const { metadata } = useJBProjectMetadataContext()
  const projectMetadata = metadata?.data

  const { data: projectOwnerAddress } = useProjectOwnerOf()

  const projectIdNum = parseInt(projectId.toString())

  const { data } = useSubgraphQuery(ProjectsDocument, {
    where: {
      projectId: projectIdNum,
    },
  })

  const projectStatsData = data?.projects?.[0]
  const {
    createdAt,
    volume: totalVolumeStr,
    trendingVolume: trendingVolumeStr,
    paymentsCount,
  } = projectStatsData ?? {
    createdAt: 0,
    volume: '0',
    trendingVolume: '0',
    paymentsCount: 0,
  }

  const totalVolume = BigInt(totalVolumeStr)
  const trendingVolume = BigInt(trendingVolumeStr)

  const { chainName } = router.query

  const last7DaysPercent = useProjectTrendingPercentageIncrease({
    totalVolume: BigNumber.from(totalVolume ?? 0),
    trendingVolume: BigNumber.from(trendingVolume ?? 0),
  })

  const { data: gnosisSafe } = useGnosisSafe(projectOwnerAddress)

  const subtitle = useSubtitle(projectMetadata ?? undefined)

  return {
    title: projectMetadata?.name,
    chainName: chainName as string, // TODO make this better. Single source for chain names, derived from useJBChainId.
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
