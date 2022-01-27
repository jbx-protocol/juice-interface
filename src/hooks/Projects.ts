import { BigNumber } from '@ethersproject/bignumber'

import { ProjectState } from 'models/project-visibility'
import { Project } from 'models/subgraph-entities/project'
import { TerminalVersion } from 'models/terminal-version'
import { EntityKeys, GraphQueryOpts, InfiniteGraphQueryOpts } from 'utils/graph'
import { getTerminalAddress } from 'utils/terminal-versions'

import { trendingWindowDays } from 'constants/trending-projects'

import { archivedProjectIds } from '../constants/archived-projects'
import { trendingProjectsCount } from '../constants/trending-projects'
import useSubgraphQuery, { useInfiniteSubgraphQuery } from './SubgraphQuery'

// Take just an object that might contain an ID. That way we can support
// arbitrary `keys` properties.
function filterOutArchivedProjects<T extends { id?: BigNumber }>(
  data: T[],
  filter?: ProjectState,
): T[] {
  switch (filter) {
    case 'active':
      return data?.filter(
        project =>
          project?.id && !archivedProjectIds.includes(project.id.toNumber()),
      )
    case 'archived':
      return data?.filter(
        project =>
          project.id && archivedProjectIds.includes(project.id.toNumber()),
      )
    default:
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
  filter?: ProjectState
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
      select: data => filterOutArchivedProjects(data, opts.filter),
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

export function useTrendingProjects() {
  const secondsInDay = 24 * 60 * 60

  const payments = useSubgraphQuery(
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
              secondsInDay * trendingWindowDays
            ).toString(),
          ),
          operator: 'gte',
        },
      ],
    },
    {
      staleTime: 10800000, // 3 hours
    },
  )

  if (!payments.data) return

  // Sum payment volume from all payments for each project
  const mapped = payments.data.reduce((acc, curr) => {
    const projectId = curr.project?.toString()

    if (!projectId) return acc

    return {
      ...acc,
      [projectId]: BigNumber.from(acc[projectId] ?? 0).add(curr.amount),
    }
  }, {} as Record<string, BigNumber>)

  // Sort project objects by volume
  const sorted = Object.keys(mapped)
    .sort((a, b) => (mapped[a].gt(mapped[b]) ? -1 : 1))
    .slice(0, trendingProjectsCount)
    .map(id => ({
      id: BigNumber.from(id),
      volume: mapped[id],
    }))

  return sorted
}

export function useInfiniteProjectsQuery(opts: ProjectsOptions) {
  return useInfiniteSubgraphQuery(
    queryOpts(opts) as InfiniteGraphQueryOpts<'project', EntityKeys<'project'>>,
    {
      staleTime,
      select: data => ({
        ...data,
        pages: data.pages.map(pageData =>
          filterOutArchivedProjects(pageData, opts.filter),
        ),
      }),
    },
  )
}
