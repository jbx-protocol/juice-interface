import { BigNumber } from '@ethersproject/bignumber'
import { NetworkName } from 'models/network-name'
import { ProjectState } from 'models/project-visibility'
import { Project } from 'models/subgraph-entities/project'

import { archivedProjectIds } from '../constants/archived-projects'
import { terminalV1_1Dict } from '../constants/terminalV1_1'
import useSubgraphQuery from './SubgraphQuery'

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

const terminalV1_1Address =
  terminalV1_1Dict[process.env.REACT_APP_INFURA_NETWORK as NetworkName]?.address

export function useProjects({
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
        projectId && terminalV1_1Address
          ? [
              {
                key: 'id',
                value: projectId.toString(),
              },
              {
                key: 'terminal',
                value: terminalV1_1Address,
              },
            ]
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
