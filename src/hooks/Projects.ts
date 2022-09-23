import { CV_V1, CV_V2 } from 'constants/cv'
import { V1ArchivedProjectIds } from 'constants/v1/archivedProjects'
import { V2ArchivedProjectIds } from 'constants/v2v3/archivedProjects'
import { CV } from 'models/cv'
import { ProjectState } from 'models/project-visibility'
import { Project } from 'models/subgraph-entities/vX/project'
import { V1TerminalVersion } from 'models/v1/terminals'
import { useEffect, useState } from 'react'
import {
  EntityKeys,
  getSubgraphIdForProject,
  GraphQueryOpts,
  InfiniteGraphQueryOpts,
  querySubgraphExhaustive,
  WhereConfig,
} from 'utils/graph'
import { getTerminalAddress } from 'utils/v1/terminals'
import useSubgraphQuery, { useInfiniteSubgraphQuery } from './SubgraphQuery'

interface ProjectsOptions {
  pageNumber?: number
  projectId?: number
  orderBy?: 'createdAt' | 'currentBalance' | 'totalPaid'
  orderDirection?: 'asc' | 'desc'
  pageSize?: number
  state?: ProjectState
  keys?: (keyof Project)[]
  terminalVersion?: V1TerminalVersion
  cv?: CV[]
}

const DEFAULT_STALE_TIME = 60 * 1000 // 60 seconds
const DEFAULT_ENTITY_KEYS: (keyof Project)[] = [
  'id',
  'projectId',
  'handle',
  'owner',
  'createdAt',
  'metadataUri',
  'metadataDomain',
  'currentBalance',
  'totalPaid',
  'totalRedeemed',
  'terminal',
  'cv',
]
const V1_ARCHIVED_SUBGRAPH_IDS = V1ArchivedProjectIds.map(projectId =>
  getSubgraphIdForProject(CV_V1, projectId),
)
const V2_ARCHIVED_SUBGRAPH_IDS = V2ArchivedProjectIds.map(projectId =>
  getSubgraphIdForProject(CV_V2, projectId),
)
const ARCHIVED_SUBGRAPH_IDS = [
  ...V1_ARCHIVED_SUBGRAPH_IDS,
  ...V2_ARCHIVED_SUBGRAPH_IDS,
]

const queryOpts = (
  opts: ProjectsOptions,
): Partial<
  | GraphQueryOpts<'project', EntityKeys<'project'>>
  | InfiniteGraphQueryOpts<'project', EntityKeys<'project'>>
> => {
  const where: WhereConfig<'project'>[] = []

  const terminalAddress = getTerminalAddress(opts.terminalVersion)

  if (terminalAddress) {
    where.push({
      key: 'terminal',
      value: terminalAddress,
    })
  }

  if (opts.cv) {
    where.push({
      key: 'cv',
      value: opts.cv,
      operator: 'in',
    })
  }

  if (opts.projectId) {
    where.push({
      key: 'projectId',
      value: opts.projectId,
    })
  } else if (opts.state === 'archived') {
    where.push({
      key: 'id',
      value: ARCHIVED_SUBGRAPH_IDS,
      operator: 'in',
    })
  } else if (ARCHIVED_SUBGRAPH_IDS.length) {
    where.push({
      key: 'id',
      value: ARCHIVED_SUBGRAPH_IDS,
      operator: 'not_in',
    })
  }

  return {
    entity: 'project',
    keys: opts.keys ?? DEFAULT_ENTITY_KEYS,
    orderDirection: opts.orderDirection ?? 'desc',
    orderBy: opts.orderBy ?? 'totalPaid',
    pageSize: opts.pageSize,
    where,
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
      staleTime: DEFAULT_STALE_TIME,
    },
  )
}

export function useProjectsSearch(handle: string | undefined) {
  return useSubgraphQuery(
    handle
      ? {
          text: `${handle}:*`,
          entity: 'projectSearch',
          keys: DEFAULT_ENTITY_KEYS,
        }
      : null,
    {
      staleTime: DEFAULT_STALE_TIME,
    },
  )
}

export function useTrendingProjects(count: number) {
  return useSubgraphQuery({
    entity: 'project',
    keys: [
      ...DEFAULT_ENTITY_KEYS,
      'trendingScore',
      'trendingPaymentsCount',
      'trendingVolume',
      'createdWithinTrendingWindow',
    ],
    first: count,
    orderBy: 'trendingScore',
    orderDirection: 'desc',
    where: [
      {
        key: 'id',
        value: ARCHIVED_SUBGRAPH_IDS,
        operator: 'not_in',
      },
    ],
  })
}

// Query all projects that a wallet has previously made payments to
export function useHoldingsProjectsQuery(wallet: string | undefined) {
  const [loadingParticipants, setLoadingParticipants] = useState<boolean>()
  const [projectIds, setProjectIds] = useState<string[]>()

  useEffect(() => {
    // Get all participant entities for wallet
    const loadParticipants = async () => {
      setLoadingParticipants(true)

      const participants = await querySubgraphExhaustive(
        wallet
          ? {
              entity: 'participant',
              orderBy: 'balance',
              orderDirection: 'desc',
              keys: [
                {
                  entity: 'project',
                  keys: ['id'],
                },
              ],
              where: [
                {
                  key: 'wallet',
                  value: wallet,
                },
              ],
            }
          : null,
      )

      if (!participants) {
        setProjectIds(undefined)
        return
      }

      // Reduce list of paid project ids
      setProjectIds(
        participants?.reduce((acc, curr) => {
          const projectId = curr?.project.id

          return [
            ...acc,
            ...(projectId ? (acc.includes(projectId) ? [] : [projectId]) : []),
          ]
        }, [] as string[]),
      )

      setLoadingParticipants(false)
    }

    loadParticipants()
  }, [wallet])

  const projectsQuery = useSubgraphQuery(
    projectIds
      ? {
          entity: 'project',
          keys: DEFAULT_ENTITY_KEYS,
          where: {
            key: 'id',
            operator: 'in',
            value: projectIds,
          },
        }
      : null,
  )

  return {
    ...projectsQuery,
    isLoading: projectsQuery.isLoading || loadingParticipants,
  }
}

export function useMyProjectsQuery(wallet: string | undefined) {
  const projectsQuery = useSubgraphQuery(
    wallet
      ? {
          entity: 'project',
          keys: DEFAULT_ENTITY_KEYS,
          where: {
            key: 'owner',
            operator: 'in',
            value: [wallet],
          },
        }
      : null,
  )

  return {
    ...projectsQuery,
  }
}

export function useInfiniteProjectsQuery(opts: ProjectsOptions) {
  return useInfiniteSubgraphQuery(
    queryOpts(opts) as InfiniteGraphQueryOpts<'project', EntityKeys<'project'>>,
    { staleTime: DEFAULT_STALE_TIME },
  )
}
