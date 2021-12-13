import { BigNumber } from '@ethersproject/bignumber'
import { getTerminalAddress } from 'utils/terminal-versions'
import { ProjectState } from 'models/project-visibility'
import { Project } from 'models/subgraph-entities/project'
import { TerminalVersion } from 'models/terminal-version'
import { EntityKeys, GraphQueryOpts, InfiniteGraphQueryOpts } from 'utils/graph'

import { archivedProjectIds } from '../constants/archived-projects'
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
}

const staleTime = 60000

const queryOpts = (
  opts: ProjectsOptions,
): Partial<
  | GraphQueryOpts<'project', EntityKeys<'project'>>
  | InfiniteGraphQueryOpts<'project', EntityKeys<'project'>>
> => {
  const terminalAddress = getTerminalAddress(opts.terminalVersion)

  return {
    entity: 'project',
    keys: [
      'id',
      'handle',
      'creator',
      'createdAt',
      'uri',
      'currentBalance',
      'totalPaid',
      'totalRedeemed',
    ],
    orderDirection: opts.orderDirection ?? 'desc',
    orderBy: opts.orderBy ?? 'totalPaid',
    pageSize: opts.pageSize,
    where: [
      ...(opts.projectId
        ? [
            {
              key: 'id',
              value: opts.projectId.toString(),
            },
          ]
        : []),
      ...(terminalAddress
        ? [
            {
              key: 'terminal',
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
