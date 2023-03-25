import axios from 'axios'
import { PV_V1, PV_V2 } from 'constants/pv'
import { V1ArchivedProjectIds } from 'constants/v1/archivedProjects'
import { V2ArchivedProjectIds } from 'constants/v2v3/archivedProjects'
import {
  InfiniteSGQueryOpts,
  SGEntityKey,
  SGQueryOpts,
  SGWhereArg,
} from 'models/graph'
import { Json } from 'models/json'
import { ProjectState } from 'models/projectVisibility'
import { PV } from 'models/pv'
import {
  SepanaProject,
  SepanaProjectQueryOpts,
  SepanaQueryResponse,
} from 'models/sepana'
import { Project } from 'models/subgraph-entities/vX/project'
import { V1TerminalVersion } from 'models/v1/terminals'
import { useEffect, useMemo, useState } from 'react'
import {
  useInfiniteQuery,
  UseInfiniteQueryOptions,
  useQuery,
  UseQueryOptions,
} from 'react-query'
import { getSubgraphIdForProject, querySubgraphExhaustive } from 'utils/graph'
import { formatQueryParams } from 'utils/queryParams'
import { parseSepanaProjectJson } from 'utils/sepana'

import useSubgraphQuery, { useInfiniteSubgraphQuery } from './SubgraphQuery'

interface ProjectsOptions {
  pageNumber?: number
  projectId?: number
  orderBy?: 'createdAt' | 'currentBalance' | 'totalPaid' | 'paymentsCount'
  orderDirection?: 'asc' | 'desc'
  pageSize?: number
  state?: ProjectState
  keys?: (keyof Project)[]
  terminalVersion?: V1TerminalVersion
  pv?: PV[]
}

type ProjectsOfParticipantsWhereQuery =
  | SGQueryOpts<'participant', SGEntityKey<'participant'>>['where']
  | null

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
  'pv',
]
const V1_ARCHIVED_SUBGRAPH_IDS = V1ArchivedProjectIds.map(projectId =>
  getSubgraphIdForProject(PV_V1, projectId),
)
const V2_ARCHIVED_SUBGRAPH_IDS = V2ArchivedProjectIds.map(projectId =>
  getSubgraphIdForProject(PV_V2, projectId),
)
const ARCHIVED_SUBGRAPH_IDS = [
  ...V1_ARCHIVED_SUBGRAPH_IDS,
  ...V2_ARCHIVED_SUBGRAPH_IDS,
]

const queryOpts = (
  opts: ProjectsOptions,
): Partial<
  | SGQueryOpts<'project', SGEntityKey<'project'>>
  | InfiniteSGQueryOpts<'project', SGEntityKey<'project'>>
> => {
  const where: SGWhereArg<'project'>[] = []

  if (opts.pv) {
    where.push({
      key: 'pv',
      value: opts.pv,
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
      ...(queryOpts(opts) as SGQueryOpts<'project', SGEntityKey<'project'>>),
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

/**
 * Search Subgraph projects by handle and return only a list of projects
 * @param handle handle tosearch
 * @param enabled query will only run if enabled
 * @returns list of projects
 */
export function useProjectsSearch(
  handle: string | undefined,
  opts?: { enabled?: boolean },
) {
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
      enabled: opts?.enabled,
    },
  )
}

export function useSepanaProjectsQuery(
  opts: SepanaProjectQueryOpts,
  reactQueryOptions?: UseQueryOptions<
    SepanaProject[],
    Error,
    SepanaProject[],
    readonly [string, SepanaProjectQueryOpts]
  >,
) {
  return useQuery<
    SepanaProject[],
    Error,
    SepanaProject[],
    readonly [string, SepanaProjectQueryOpts]
  >(
    ['sepana-tags-query', opts],
    () =>
      axios
        .get<SepanaQueryResponse<Json<SepanaProject>>>(
          `/api/sepana/projects?${formatQueryParams(opts)}`,
        )
        .then(res =>
          res.data.hits.hits.map(h => parseSepanaProjectJson(h._source)),
        ),
    {
      staleTime: DEFAULT_STALE_TIME,
      ...reactQueryOptions,
    },
  )
}

export function useSepanaProjectsInfiniteQuery(
  opts: SepanaProjectQueryOpts,
  reactQueryOptions?: UseInfiniteQueryOptions<
    SepanaProject[],
    Error,
    SepanaProject[],
    SepanaProject[],
    readonly [string, SepanaProjectQueryOpts]
  >,
) {
  return useInfiniteQuery(
    ['sepana-tags-query', opts],
    async ({
      queryKey,
      pageParam = 1, // page is a 1-based index
    }) => {
      const { pageSize, ...evaluatedOpts } = queryKey[1]

      return axios
        .get<SepanaQueryResponse<Json<SepanaProject>>>(
          `/api/sepana/projects?${formatQueryParams({
            ...evaluatedOpts,
            page: pageParam,
            pageSize,
          })}`,
        )
        .then(res =>
          res.data.hits.hits.map(h => parseSepanaProjectJson(h._source)),
        )
    },
    {
      staleTime: DEFAULT_STALE_TIME,
      ...reactQueryOptions,
      // Don't allow this function to be overwritten by reactQueryOptions
      getNextPageParam: (lastPage, allPages) => {
        // If the last page contains less than the expected page size,
        // it's safe to assume you're at the end.
        if (opts.pageSize && lastPage.length < opts.pageSize) {
          return false
        } else {
          return allPages.length
        }
      },
    },
  )
}

export function useTrendingProjects(count: number) {
  const whereQuery: SGWhereArg<'project'>[] = []

  if (ARCHIVED_SUBGRAPH_IDS.length) {
    whereQuery.push({
      key: 'id',
      value: ARCHIVED_SUBGRAPH_IDS,
      operator: 'not_in',
    })
  }

  return useSubgraphQuery({
    entity: 'project',
    keys: [
      ...DEFAULT_ENTITY_KEYS,
      'trendingScore',
      'paymentsCount',
      'trendingPaymentsCount',
      'trendingVolume',
      'createdWithinTrendingWindow',
    ],
    first: count,
    orderBy: 'trendingScore',
    orderDirection: 'desc',
    where: whereQuery,
  })
}

// Query all projects that a wallet has previously made payments to
export function useContributedProjectsQuery(wallet: string | undefined) {
  const where = useMemo((): ProjectsOfParticipantsWhereQuery => {
    if (!wallet) return null

    return [
      {
        key: 'wallet',
        value: wallet.toLowerCase(),
      },
      {
        key: 'totalPaid',
        operator: 'gt',
        value: 0,
      },
    ]
  }, [wallet])

  return useProjectsOfParticipants(where)
}

// Query all projects that a wallet holds tokens for
export function useHoldingsProjectsQuery(wallet: string | undefined) {
  const where = useMemo((): ProjectsOfParticipantsWhereQuery => {
    if (!wallet) return null

    return [
      {
        key: 'wallet',
        value: wallet.toLowerCase(),
      },
      {
        key: 'balance',
        operator: 'gt',
        value: 0,
      },
    ]
  }, [wallet])

  return useProjectsOfParticipants(where)
}

function useProjectsOfParticipants(where: ProjectsOfParticipantsWhereQuery) {
  const [loadingParticipants, setLoadingParticipants] = useState<boolean>()
  const [projectIds, setProjectIds] = useState<string[]>()

  useEffect(() => {
    // Get all participant entities for wallet
    const loadParticipants = async () => {
      setLoadingParticipants(true)

      const participants = await querySubgraphExhaustive(
        where
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
              where,
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
  }, [where])

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
          orderBy: 'createdAt',
          orderDirection: 'desc',
        }
      : null,
  )

  return {
    ...projectsQuery,
  }
}

export function useInfiniteProjectsQuery(opts: ProjectsOptions) {
  return useInfiniteSubgraphQuery(
    queryOpts(opts) as InfiniteSGQueryOpts<'project', SGEntityKey<'project'>>,
    { staleTime: DEFAULT_STALE_TIME },
  )
}
