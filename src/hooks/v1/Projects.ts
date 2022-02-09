import { BigNumber } from '@ethersproject/bignumber'

import { ProjectStateFilter } from 'models/project-visibility'
import { Project, TrendingProject } from 'models/subgraph-entities/project'
import { V1TerminalVersion } from 'models/v1/terminals'
import {
  EntityKeys,
  GraphQueryOpts,
  InfiniteGraphQueryOpts,
  querySubgraphExhaustive,
} from 'utils/graph'
import { getTerminalAddress } from 'utils/v1/terminals'

import { useEffect, useState } from 'react'

import { SECONDS_IN_DAY } from 'constants/numbers'

import { archivedProjectIds } from '../../constants/v1/archivedProjects'
import useSubgraphQuery, { useInfiniteSubgraphQuery } from '../SubgraphQuery'

// Take just an object that might contain an ID. That way we can support
// arbitrary `keys` properties.
function filterByProjectState<T extends { id?: BigNumber }>(
  data: T[],
  filter?: ProjectStateFilter,
): T[] {
  if (filter?.active && !filter?.archived) {
    return data?.filter(
      project =>
        project?.id && !archivedProjectIds.includes(project.id.toNumber()),
    )
  } else if (!filter?.active && filter?.archived) {
    return data?.filter(
      project =>
        project.id && archivedProjectIds.includes(project.id.toNumber()),
    )
  } else {
    // If both or neither are set, show everything
    return data
  }
}

interface ProjectsOptions {
  pageNumber?: number
  projectId?: BigNumber
  handle?: string
  uri?: string
  orderBy?: 'createdAt' | 'currentBalance' | 'totalPaid'
  orderDirection?: 'asc' | 'desc'
  pageSize?: number
  states?: ProjectStateFilter
  keys?: (keyof Project)[]
  terminalVersion?: V1TerminalVersion
  searchText?: string
}

const staleTime = 60 * 1000 // 60 seconds

const keys: (keyof Project)[] = [
  'id',
  'handle',
  'creator',
  'createdAt',
  'uri',
  'currentBalance',
  'totalPaid',
  'totalRedeemed',
  'terminal',
]

const queryOpts = (
  opts: ProjectsOptions,
): Partial<
  | GraphQueryOpts<'project', EntityKeys<'project'>>
  | InfiniteGraphQueryOpts<'project', EntityKeys<'project'>>
> => {
  const terminalAddress = getTerminalAddress(opts.terminalVersion)

  return {
    entity: 'project',
    keys: opts.keys ?? keys,
    orderDirection: opts.orderDirection ?? 'desc',
    orderBy: opts.orderBy ?? 'totalPaid',
    pageSize: opts.pageSize,
    where: [
      ...(opts.projectId
        ? [
            {
              key: 'id' as const,
              value: opts.projectId.toString(),
            },
          ]
        : []),
      ...(terminalAddress
        ? [
            {
              key: 'terminal' as const,
              value: terminalAddress,
            },
          ]
        : []),
    ],
  }
}

export function useProjectsQuery(opts: ProjectsOptions) {
  return useSubgraphQuery(
    {
      ...(queryOpts(opts) as GraphQueryOpts<'project', EntityKeys<'project'>>),
      first: opts.pageSize,
      skip:
        opts.pageNumber && opts.pageSize
          ? opts.pageNumber * opts.pageSize
          : undefined,
    },
    {
      staleTime,
      select: data => filterByProjectState(data, opts.states),
    },
  )
}

export function useProjectsSearch(handle: string | undefined) {
  return useSubgraphQuery(
    handle
      ? {
          text: `${handle}:*`,
          entity: 'projectSearch',
          keys,
        }
      : null,
    {
      staleTime,
    },
  )
}

// Returns projects with highest % volume increase in last week
export function useTrendingProjects(count: number, days: number) {
  const [loadingPayments, setLoadingPayments] = useState<boolean>()
  const [projectStats, setProjectStats] = useState<
    Record<
      string,
      {
        trendingVolume: BigNumber
        paymentsCount: number
      }
    >
  >()

  useEffect(() => {
    const loadPayments = async () => {
      setLoadingPayments(true)

      const daySeconds = days * SECONDS_IN_DAY
      const now = new Date().setUTCHours(0, 0, 0, 0) // get start of day, for determinism
      const nowSeconds = now.valueOf() / 1000

      const payments = await querySubgraphExhaustive({
        entity: 'payEvent',
        keys: [
          'amount',
          {
            entity: 'project',
            keys: ['id'],
          },
        ],
        where: [
          {
            key: 'timestamp',
            value: nowSeconds - daySeconds,
            operator: 'gte',
          },
        ],
      })

      // Project data mapped trending data calculated from payments
      setProjectStats(
        (payments ?? []).reduce(
          (acc, curr) => {
            const projectId = curr.project.id?.toString()

            return projectId
              ? {
                  ...acc,
                  [projectId]: {
                    trendingVolume: BigNumber.from(
                      acc[projectId]?.trendingVolume ?? 0,
                    ).add(curr.amount),
                    paymentsCount: (acc[projectId]?.paymentsCount ?? 0) + 1,
                  },
                }
              : acc
          },
          {} as Record<
            string,
            {
              trendingVolume: BigNumber
              paymentsCount: number
            }
          >,
        ),
      )

      setLoadingPayments(false)
    }

    loadPayments()
  }, [count, days])

  // Query project data for all trending project IDs
  const projectsQuery = useSubgraphQuery(
    projectStats
      ? {
          entity: 'project',
          keys,
          where: {
            key: 'id',
            value: Object.keys(projectStats),
            operator: 'in',
          },
        }
      : null,
  )

  return {
    ...projectsQuery,
    isLoading: projectsQuery.isLoading || loadingPayments,
    // Return TrendingProjects sorted by `trendingScore`
    data: projectsQuery.data
      ?.map(p => {
        const stats =
          p.id && projectStats ? projectStats[p.id.toString()] : undefined

        // Algorithm to rank trending projects:
        //   -  trendingScore = (volume gained in x days) * (number of payments made in x days)^2
        const trendingScore = stats?.trendingVolume.mul(
          BigNumber.from(stats.paymentsCount).pow(2),
        )

        return {
          ...p,
          trendingScore,
          trendingVolume: stats?.trendingVolume,
          trendingPaymentsCount: stats?.paymentsCount,
        } as TrendingProject
      })
      .sort((a, b) => (a.trendingScore?.gt(b.trendingScore ?? 0) ? -1 : 1))
      .slice(0, count),
  }
}

// Query all projects that a wallet has previously made payments to
export function useHoldingsProjectsQuery(wallet: string | undefined) {
  const [loadingParticipants, setLoadingParticipants] = useState<boolean>()
  const [projectIds, setProjectIds] = useState<string[]>()

  useEffect(() => {
    // Get all participant entities for wallet
    const loadParticipants = async () => {
      setLoadingParticipants(true)

      const participants = await querySubgraphExhaustive(
        wallet
          ? {
              entity: 'participant',
              orderBy: 'balance',
              orderDirection: 'desc',
              keys: [
                {
                  entity: 'project',
                  keys: ['id'],
                },
              ],
              where: [
                {
                  key: 'wallet',
                  value: wallet,
                },
              ],
            }
          : null,
      )

      if (!participants) {
        setProjectIds(undefined)
        return
      }

      // Reduce list of paid project ids
      setProjectIds(
        participants?.reduce((acc, curr) => {
          const projectId = curr?.project?.id?.toString()

          return [
            ...acc,
            ...(projectId ? (acc.includes(projectId) ? [] : [projectId]) : []),
          ]
        }, [] as string[]),
      )

      setLoadingParticipants(false)
    }

    loadParticipants()
  }, [wallet])

  const projectsQuery = useSubgraphQuery(
    projectIds
      ? {
          entity: 'project',
          keys,
          where: {
            key: 'id',
            operator: 'in',
            value: projectIds,
          },
        }
      : null,
  )

  return {
    ...projectsQuery,
    isLoading: projectsQuery.isLoading || loadingParticipants,
  }
}

export function useInfiniteProjectsQuery(opts: ProjectsOptions) {
  return useInfiniteSubgraphQuery(
    queryOpts(opts) as InfiniteGraphQueryOpts<'project', EntityKeys<'project'>>,
    {
      staleTime,
      select: data => ({
        ...data,
        pages: data.pages.map(pageData =>
          filterByProjectState(pageData, opts.states),
        ),
      }),
    },
  )
}
