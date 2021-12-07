import { BigNumber } from '@ethersproject/bignumber'

import { ProjectState } from 'models/project-visibility'
import { Project } from 'models/subgraph-entities/project'

import useSubgraphQuery from './SubgraphQuery'
import { archivedProjectIds } from '../constants/archived-projects'

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
      select: data => {
        switch (filter) {
          case 'active':
            return data?.filter(
              project =>
                project?.id &&
                !archivedProjectIds.includes(project.id.toNumber()),
            )
          case 'archived':
            return data?.filter(
              project =>
                project.id &&
                archivedProjectIds.includes(project.id.toNumber()),
            )
          default:
            return data
        }
      },
    },
  )
}
