import { BigNumber } from '@ethersproject/bignumber'

import { ProjectState } from 'models/project-visibility'
import {
  parseProjectJson,
  Project,
  ProjectJson,
} from 'models/subgraph-entities/project'
import { useMemo } from 'react'
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
}

export function useProjects({
  pageNumber,
  projectId,
  handle,
  uri,
  orderBy,
  orderDirection,
  pageSize,
  filter,
}: ProjectsOptions) {
  const { data, ...query } = useSubgraphQuery(
    {
      entity: 'project',
      keys: [
        'handle',
        'creator',
        'createdAt',
        'uri',
        'currentBalance',
        'totalPaid',
        'totalRedeemed',
      ],
      first: pageSize,
      skip: pageNumber ? pageNumber * (pageSize ?? 50) : undefined,
      orderDirection: orderDirection ?? 'desc',
      orderBy: orderBy ?? 'totalPaid',
    },
    {
      staleTime: 60000,
    },
  )

  const filteredProjects = useMemo(() => {
    const projects = data?.projects?.map(
      (p: ProjectJson) => parseProjectJson(p) as Project,
    )

    switch (filter) {
      case 'active':
        return projects?.filter(
          _p => !archivedProjectIds.includes(_p.id.toNumber()),
        )
      case 'archived':
        return projects?.filter(_p =>
          archivedProjectIds.includes(_p.id.toNumber()),
        )
      default:
        return projects
    }
  }, [data?.projects, filter])

  return {
    data: filteredProjects,
    ...query,
  }
}
