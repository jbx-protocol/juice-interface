import { BigNumber } from '@ethersproject/bignumber'

import { ProjectState } from 'models/project-visibility'
import {
  parseProjectJson,
  Project,
  ProjectJson,
} from 'models/subgraph-entities/project'
import { useEffect, useMemo, useState } from 'react'

import { archivedProjectIds } from 'constants/archived-projects'

import { querySubgraph } from '../utils/graph'

export function useProjects({
  pageNumber,
  projectId,
  handle,
  uri,
  orderBy,
  orderDirection,
  pageSize,
  filter,
}: {
  pageNumber?: number
  projectId?: BigNumber
  handle?: string
  uri?: string
  orderBy?: 'createdAt' | 'currentBalance' | 'totalPaid'
  orderDirection?: 'asc' | 'desc'
  pageSize?: number
  filter?: ProjectState
}) {
  const [projects, setProjects] = useState<Project[]>()

  useEffect(() => {
    querySubgraph(
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
      res =>
        setProjects(
          res?.projects?.map(
            (p: ProjectJson) => parseProjectJson(p) as Project,
          ) ?? [],
        ),
    )
  }, [pageNumber, projectId, handle, uri, orderDirection, orderBy, pageSize])

  const activeProjects = useMemo(() => {
    return projects?.filter(
      _p => !archivedProjectIds.includes(_p.id.toNumber()),
    )
  }, [projects])

  const archivedProjects = useMemo(() => {
    return projects?.filter(_p => archivedProjectIds.includes(_p.id.toNumber()))
  }, [projects])

  switch (filter) {
    case 'active':
      return activeProjects
    case 'archived':
      return archivedProjects
    default:
      return projects
  }
}
