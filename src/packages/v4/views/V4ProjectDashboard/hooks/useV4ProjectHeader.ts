import { useQuery } from '@tanstack/react-query'
import { BigNumber } from 'ethers'
import request from 'graphql-request'
import { useGnosisSafe } from 'hooks/safe/useGnosisSafe'
import { useProjectTrendingPercentageIncrease } from 'hooks/useProjectTrendingPercentageIncrease'
import { SubtitleType, useSubtitle } from 'hooks/useSubtitle'
import {
  useJBContractContext,
  useJBProjectMetadataContext,
  useSuckers,
} from 'juice-sdk-react'
import { v4SubgraphUri } from 'lib/apollo/subgraphUri'
import { GnosisSafe } from 'models/safe'
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
}

export const useV4ProjectHeader = (): ProjectHeaderData => {
  const { projectId } = useJBContractContext()
  const { metadata } = useJBProjectMetadataContext()
  const projectMetadata = metadata?.data

  const { data: projectOwnerAddress } = useProjectOwnerOf()

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

  const { data: totalPayments, isLoading: totalPaymentsIsLoading } =
    useTotalPaymentsCount() ?? 0

  // Fallback to the local chain as subgraph omnichain call can take a while
  const paymentsCount = totalPaymentsIsLoading
    ? projectStatsData?.paymentsCount
    : totalPayments

  const {
    createdAt,
    volume: totalVolumeStr,
    trendingVolume: trendingVolumeStr,
  } = projectStatsData ?? {
    createdAt: 0,
    volume: '0',
    trendingVolume: '0',
    paymentsCount: 0,
  }

  const totalVolume = BigInt(totalVolumeStr)
  const trendingVolume = BigInt(trendingVolumeStr)

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

const useTotalPaymentsCount = () => {
  const { data: suckers, isLoading: suckersIsLoading } = useSuckers()

  return useQuery({
    enabled: !suckersIsLoading,
    queryKey: ['totalPaymentsCount', suckers],
    queryFn: async () => {
      if (!suckers?.length) {
        return 0
      }
      return await Promise.allSettled(
        suckers.map(async sucker => {
          const uri = v4SubgraphUri(sucker.peerChainId)
          return await request(uri, ProjectsDocument, {
            where: {
              projectId: Number(sucker.projectId),
            },
          })
        }),
      ).then(results => {
        return results.reduce((acc, result) => {
          if (result.status === 'rejected') {
            console.error(result.reason)
            return acc
          }
          return acc + (result.value.projects[0]?.paymentsCount ?? 0)
        }, 0)
      })
    },
  })
}
