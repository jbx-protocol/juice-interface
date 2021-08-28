import { BigNumber } from '@ethersproject/bignumber'
import axios, { AxiosResponse } from 'axios'
import { subgraphUrl } from 'constants/subgraphs'
import {
  parseProjectJson,
  Project,
  ProjectJson,
} from 'models/subgraph-entities/project'
import { useEffect, useState } from 'react'
import { formatGraphQuery } from 'utils/graph'

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
  orderBy?: 'id' | 'currentBalance' | 'totalPaid'
  orderDirection?: 'asc' | 'desc'
  pageSize?: number
}) {
  const [projects, setProjects] = useState<Project[]>()

  useEffect(() => {
    axios
      .post(
        subgraphUrl,
        {
          query: formatGraphQuery({
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
          }),
        },
        { headers: { 'Content-Type': 'application/json' } },
      )
      .then((res: AxiosResponse<{ data: { projects: ProjectJson[] } }>) =>
        setProjects(
          res.data?.data?.projects?.map((p: ProjectJson) =>
            parseProjectJson(p),
          ) ?? [],
        ),
      )
      .catch(err => console.log('Error getting projects', err))
  }, [pageNumber, projectId, handle, uri, orderDirection, orderBy])

  return projects
}
