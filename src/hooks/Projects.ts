import { BigNumber } from '@ethersproject/bignumber'
import { ProjectState } from 'models/project-visibility'
import { Project } from 'models/subgraph-entities/project'

import { archivedProjectIds } from '../constants/archived-projects'
import { terminalAddress } from '../constants/terminal-versions'
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
  terminal?: string
  pageNumber?: number
  projectId?: BigNumber
  handle?: string
  uri?: string
  orderBy?: 'createdAt' | 'currentBalance' | 'totalPaid'
  orderDirection?: 'asc' | 'desc'
  pageSize?: number
  filter?: ProjectState
  keys?: (keyof Project)[]
}

let defaultPageSize = 20

export function useProjectsQuery({
  pageNumber,
  projectId,
  keys,
  handle,
  uri,
  orderBy,
  orderDirection,
  pageSize = defaultPageSize,
  filter,
}: ProjectsOptions) {
  return useSubgraphQuery(
    {
      entity: 'project',
      keys: keys ?? [
        'id',
        'handle',
        'creator',
        'createdAt',
        'uri',
        'currentBalance',
        'totalPaid',
        'totalRedeemed',
      ],
      first: pageSize,
      skip: pageNumber ? pageNumber * pageSize : undefined,
      orderDirection: orderDirection ?? 'desc',
      orderBy: orderBy ?? 'totalPaid',
      where: projectId
        ? [
            {
              key: 'id',
              value: projectId.toString(),
            },
            {
              key: 'terminal',
              value: terminalAddress,
            },
          ]
        : undefined,
    },
    {
      staleTime: 60000,
      select: data => filterOutArchivedProjects(data, filter),
    },
  )
}

export function useInfiniteProjectsQuery({
  projectId,
  keys,
  handle,
  uri,
  orderBy,
  orderDirection,
  pageSize = defaultPageSize,
  filter,
}: ProjectsOptions) {
  return useInfiniteSubgraphQuery(
    {
      pageSize,
      entity: 'project',
      keys: keys ?? [
        'id',
        'handle',
        'creator',
        'createdAt',
        'uri',
        'currentBalance',
        'totalPaid',
        'totalRedeemed',
      ],
      orderDirection: orderDirection ?? 'desc',
      orderBy: orderBy ?? 'totalPaid',
      where:
        projectId != null
          ? {
              key: 'id',
              value: projectId.toString(),
            }
          : undefined,
    },
    {
      staleTime: 60000,

      select: data => ({
        ...data,
        pages: data.pages.map(pageData =>
          filterOutArchivedProjects(pageData, filter),
        ),
      }),
    },
  )
}
