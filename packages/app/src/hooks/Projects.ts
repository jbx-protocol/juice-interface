import { BigNumber } from '@ethersproject/bignumber'
import {
  parseProjectJson,
  Project,
  ProjectJson,
} from 'models/subgraph-entities/project'
import { useEffect, useState } from 'react'

import { querySubgraph } from '../utils/graph'

export function useProjects({
  pageNumber,
  projectId,
  handle,
  uri,
  orderBy,
  orderDirection,
  pageSize,
}: {
  pageNumber?: number
  projectId?: BigNumber
  handle?: string
  uri?: string
  orderBy?: 'createdAt' | 'currentBalance' | 'totalPaid'
  orderDirection?: 'asc' | 'desc'
  pageSize?: number
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

  return projects
}
