import { BigNumber } from '@ethersproject/bignumber'

import { ProjectStateFilter } from 'models/project-visibility'
import { Project, TrendingProject } from 'models/subgraph-entities/project'
import { TerminalVersion } from 'models/terminal-version'
import { EntityKeys, GraphQueryOpts, InfiniteGraphQueryOpts } from 'utils/graph'
import { getTerminalAddress } from 'utils/terminal-versions'

import {
  trendingStaleTime,
  trendingWindowDays,
} from 'constants/trending-projects'

import { archivedProjectIds } from '../constants/archived-projects'
import useSubgraphQuery, { useInfiniteSubgraphQuery } from './SubgraphQuery'
import { SECONDS_IN_DAY } from 'constants/numbers'

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
  terminalVersion?: TerminalVersion
  searchText?: string
}

const staleTime = 60000

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
export function useTrendingProjects(count: number) {
  const { data: payments } = useSubgraphQuery(
    {
      first: 1000,
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
          value: parseInt(
            (
              new Date().valueOf() / 1000 -
              trendingWindowDays * SECONDS_IN_DAY
            ).toString(),
          ),
          operator: 'gte',
        },
      ],
    },
    {
      staleTime: trendingStaleTime,
    },
  )

  // Project data mapped trending data calculated from payments
  const projectStats = (payments ?? []).reduce(
    (acc, curr) => {
      const projectId = curr.project?.toString()

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
  )

  const projectIds = Object.keys(projectStats)

  // Query project data for all trending project IDs
  const projects = useSubgraphQuery(
    projectIds.length
      ? {
          entity: 'project',
          keys,
          where: {
            key: 'id',
            value: projectIds,
            operator: 'in',
          },
        }
      : null,
    {
      staleTime: trendingStaleTime,
    },
  )

  return {
    ...projects,
    // Return TrendingProjects sorted by `trendingScore`
    data: projects.data
      ?.map(p => {
        const stats = p.id ? projectStats[p.id.toString()] : undefined

        // Arbitrary algorithm
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
export function useMyProjectsQuery(wallet: string | undefined) {
  const { data: payments } = useSubgraphQuery(
    wallet
      ? {
          entity: 'payEvent',
          first: 1000,
          orderBy: 'timestamp',
          orderDirection: 'desc',
          keys: [
            'timestamp',
            {
              entity: 'project',
              keys: ['id'],
            },
          ],
          where: [
            {
              key: 'beneficiary',
              value: wallet,
            },
          ],
        }
      : null,
  )

  const ids = payments?.reduce(
    (acc, curr) => [
      ...acc,
      ...(curr.project
        ? acc.includes(curr.project.toString())
          ? []
          : [curr.project.toString()]
        : []),
    ],
    [] as string[],
  )

  return useSubgraphQuery(
    ids
      ? {
          entity: 'project',
          first: 1000,
          keys,
          where: {
            key: 'id',
            operator: 'in',
            value: ids,
          },
        }
      : null,
  )
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
