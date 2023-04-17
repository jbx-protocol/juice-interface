import axios from 'axios'
import { PV_V1, PV_V2 } from 'constants/pv'
import { V1ArchivedProjectIds } from 'constants/v1/archivedProjects'
import { V2ArchivedProjectIds } from 'constants/v2v3/archivedProjects'
import { BigNumber } from 'ethers'
import { DBProject, DBProjectQueryOpts, DBProjectRow } from 'models/dbProject'
import {
  InfiniteSGQueryOpts,
  SGEntity,
  SGEntityKey,
  SGQueryOpts,
  SGWhereArg,
} from 'models/graph'
import { Json } from 'models/json'
import { ProjectState } from 'models/projectVisibility'
import { PV } from 'models/pv'
import { Project } from 'models/subgraph-entities/vX/project'
import { V1TerminalVersion } from 'models/v1/terminals'
import { useEffect, useMemo, useState } from 'react'
import {
  UseInfiniteQueryOptions,
  UseQueryOptions,
  useInfiniteQuery,
  useQuery,
} from 'react-query'
import {
  getSubgraphIdForProject,
  parseSubgraphEntity,
  querySubgraphExhaustive,
} from 'utils/graph'
import { formatQueryParams } from 'utils/queryParams'
import { parseDBProjectJson, parseDBProjectsRow } from 'utils/sgDbProjects'
import useSubgraphQuery from './useSubgraphQuery'

interface ProjectsOptions {
  pageNumber?: number
  projectId?: number
  projectIds?: number[]
  orderBy?: 'createdAt' | 'currentBalance' | 'volume' | 'paymentsCount'
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
export const DEFAULT_PROJECT_ENTITY_KEYS: (keyof Project)[] = [
  'id',
  'projectId',
  'handle',
  'createdAt',
  'metadataUri',
  'volume',
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

const buildProjectQueryOpts = (
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

  if (opts.projectIds) {
    where.push({
      key: 'projectId',
      value: opts.projectIds,
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
    keys: opts.keys ?? DEFAULT_PROJECT_ENTITY_KEYS,
    orderDirection: opts.orderDirection ?? 'desc',
    orderBy: opts.orderBy ?? 'volume',
    pageSize: opts.pageSize,
    where,
  }
}

export function useProjectsQuery(opts: ProjectsOptions) {
  return useSubgraphQuery(
    {
      ...(buildProjectQueryOpts(opts) as SGQueryOpts<
        'project',
        SGEntityKey<'project'>
      >),
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

export function useDBProjectsQuery(
  opts: DBProjectQueryOpts,
  reactQueryOptions?: UseQueryOptions<
    DBProject[],
    Error,
    DBProject[],
    readonly [string, DBProjectQueryOpts]
  >,
) {
  return useQuery<
    DBProject[],
    Error,
    DBProject[],
    readonly [string, DBProjectQueryOpts]
  >(
    ['dbp-query', opts],
    () =>
      axios
        .get<Json<DBProjectRow>[]>(`/api/projects?${formatQueryParams(opts)}`)
        .then(res =>
          res.data?.map(p => parseDBProjectJson(parseDBProjectsRow(p))),
        ),
    {
      staleTime: DEFAULT_STALE_TIME,
      ...reactQueryOptions,
    },
  )
}

export function useDBProjectsInfiniteQuery(
  opts: DBProjectQueryOpts,
  reactQueryOptions?: UseInfiniteQueryOptions<
    DBProject[],
    Error,
    DBProject[],
    DBProject[],
    readonly [string, DBProjectQueryOpts]
  >,
) {
  return useInfiniteQuery(
    ['dbp-infinite-query', opts],
    async ({ queryKey, pageParam }) => {
      const { pageSize, ...evaluatedOpts } = queryKey[1]

      return axios
        .get<DBProjectRow[]>(
          `/api/projects?${formatQueryParams({
            ...evaluatedOpts,
            page: pageParam,
            pageSize,
          })}`,
        )
        .then(res =>
          res.data?.map(p => parseDBProjectJson(parseDBProjectsRow(p))),
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
  return useQuery(['trending-projects', count], async () => {
    const res = await axios.get<{
      projects: Json<SGEntity<'project', keyof Project>>[]
    }>('/api/projects/trending?count=' + count)

    const projects = res.data.projects.map(p =>
      parseSubgraphEntity('project', p),
    )

    return projects
  })
}

export function useParticipantContributions(wallet: string | undefined) {
  return useSubgraphQuery(
    wallet
      ? {
          entity: 'participant',
          where: {
            key: 'wallet',
            value: wallet.toLowerCase(),
          },
          keys: ['projectId', 'pv', 'totalPaid', 'lastPaidTimestamp'],
          orderBy: 'lastPaidTimestamp',
          orderDirection: 'desc',
        }
      : null,
  )
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
        key: 'volume',
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
          keys: DEFAULT_PROJECT_ENTITY_KEYS,
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
          keys: DEFAULT_PROJECT_ENTITY_KEYS,
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

export function useProjectTrendingPercentageIncrease({
  totalVolume,
  trendingVolume,
}: {
  totalVolume: BigNumber
  trendingVolume: BigNumber
}): number {
  const percentageGain = useMemo(() => {
    const preTrendingVolume = totalVolume?.sub(trendingVolume)

    if (!preTrendingVolume?.gt(0)) return Infinity

    const percentGain = trendingVolume
      .mul(10000)
      .div(preTrendingVolume)
      .toNumber()

    let percentRounded: number

    // If percentGain > 1, round to int
    if (percentGain >= 100) {
      percentRounded = Math.round(percentGain / 100)
      // If 0.1 <= percentGain < 1, round to 1dp
    } else if (percentGain >= 10) {
      percentRounded = Math.round(percentGain / 10) / 10
      // If percentGain < 0.1, round to 2dp
    } else {
      percentRounded = percentGain / 100
    }

    return percentRounded
  }, [totalVolume, trendingVolume])

  return percentageGain
}
