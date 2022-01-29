import { BigNumber } from '@ethersproject/bignumber'

import { ProjectState } from 'models/project-visibility'
import { Project } from 'models/subgraph-entities/project'
import { TerminalVersion } from 'models/terminal-version'
import { EntityKeys, GraphQueryOpts, InfiniteGraphQueryOpts } from 'utils/graph'
import { getTerminalAddress } from 'utils/terminal-versions'

import {
  trendingStaleTime,
  trendingWindowDays,
} from 'constants/trending-projects'

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

// Returns projects with highest % volume increase in last week
// excluding JuiceboxDAO (ID=1)
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
      staleTime: trendingStaleTime,
    },
  )

  // Record total payment volume for each project
  const mapped = (payments.data ?? []).reduce((acc, curr) => {
    const projectId = curr.project?.toString()

    return projectId && projectId !== '1'
      ? {
          ...acc,
          [projectId]: BigNumber.from(acc[projectId] ?? 0).add(curr.amount),
        }
      : acc
  }, {} as Record<string, BigNumber>)

  // Get IDs for `trendingProjectsCount` number of highest volume projects
  const sortedProjectIds = Object.keys(mapped)
    .sort((a, b) => (mapped[a].gt(mapped[b]) ? -1 : 1))
    .slice(0, trendingProjectsCount)

  // Query project data for all trending project IDs
  const projects = useSubgraphQuery(
    sortedProjectIds.length
      ? {
          entity: 'project',
          keys,
          where: {
            key: 'id',
            value: sortedProjectIds,
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
    // Return projects with `trendingVolume` sorted by `trendingVolume`
    data: projects.data
      ?.map(p => ({
        ...p,
        trendingVolume: p.id ? mapped[p.id.toString()] : undefined,
      }))
      .sort((a, b) => (a.trendingVolume?.gt(b.trendingVolume ?? 0) ? -1 : 1)),
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
          filterOutArchivedProjects(pageData, opts.filter),
        ),
      }),
    },
  )
}
