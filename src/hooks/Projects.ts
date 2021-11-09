import { BigNumber } from '@ethersproject/bignumber'
import { hiddenProjectIds } from 'constants/hidden-projects'
import {
  parseProjectJson,
  Project,
  ProjectJson,
} from 'models/subgraph-entities/project'
import { useEffect, useMemo, useState } from 'react'

import { querySubgraph } from '../utils/graph'

export function useProjects({
  pageNumber,
  projectId,
  handle,
  uri,
  orderBy,
  orderDirection,
  pageSize,
  includeHidden,
}: {
  pageNumber?: number
  projectId?: BigNumber
  handle?: string
  uri?: string
  orderBy?: 'createdAt' | 'currentBalance' | 'totalPaid'
  orderDirection?: 'asc' | 'desc'
  pageSize?: number
  includeHidden?: boolean
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
  }, [pageNumber, projectId, handle, uri, orderDirection, orderBy])

  const visibleProjects = useMemo(() => {
    if (includeHidden || !projects?.length) return []

    return projects.filter(_p => !hiddenProjectIds.includes(_p.id.toNumber()))
  }, [projects])

  return includeHidden ? projects : visibleProjects
}
