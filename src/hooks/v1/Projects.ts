import { BigNumber } from '@ethersproject/bignumber'

import { ProjectState } from 'models/project-visibility'
import { Project, TrendingProject } from 'models/subgraph-entities/project'
import { V1TerminalVersion } from 'models/v1/terminals'
import {
  EntityKeys,
  GraphQueryOpts,
  InfiniteGraphQueryOpts,
  querySubgraphExhaustive,
  WhereConfig,
} from 'utils/graph'
import { getTerminalAddress } from 'utils/v1/terminals'

import { useEffect, useState } from 'react'

import { SECONDS_IN_DAY } from 'constants/numbers'

import { archivedProjectIds } from '../../constants/v1/archivedProjects'
import useSubgraphQuery, { useInfiniteSubgraphQuery } from '../SubgraphQuery'
import {
  uploadTrendingProjectsCache,
  getTrendingProjectsCache,
  unpinIpfsFileByCid,
  ipfsCidUrl,
} from '../../utils/ipfs'
import axios from 'axios'
import moment from 'moment'

interface ProjectsOptions {
  pageNumber?: number
  projectId?: BigNumber
  handle?: string
  uri?: string
  orderBy?: 'createdAt' | 'currentBalance' | 'totalPaid'
  orderDirection?: 'asc' | 'desc'
  pageSize?: number
  state?: ProjectState
  keys?: (keyof Project)[]
  terminalVersion?: V1TerminalVersion
  searchText?: string
}

const staleTime = 60 * 1000 // 60 seconds

const keys: (keyof Project)[] = [
  'id',
  'handle',
  'creator',
  'createdAt',
  'uri',
  'currentBalance',
  'totalPaid',
  'totalRedeemed',
  'terminal',
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
      key: 'terminal' as const,
      value: terminalAddress,
    })
  }

  if (opts.state === 'archived') {
    where.push({
      key: 'id' as const,
      value: archivedProjectIds,
      operator: 'in',
    })
  } else if (opts.projectId) {
    where.push({
      key: 'id' as const,
      value: opts.projectId.toString(),
    })
  }

  return {
    entity: 'project',
    keys: opts.keys ?? keys,
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
      staleTime,
    },
  )
}

export function useProjectsSearch(handle: string | undefined) {
  return useSubgraphQuery(
    handle
      ? {
          text: `${handle}:*`,
          entity: 'projectSearch',
          keys,
        }
      : null,
    {
      staleTime,
    },
  )
}

export function useTrendingProjectsCache() {
  const [cache, setCache] = useState<TrendingProject[] | null>()

  useEffect(() => {
    getTrendingProjectsCache().then(async res => {
      if (!res.count) {
        setCache(null)
        return
      }

      // Most recent cache file is returned first in array
      const latest = res.rows[0]

      // Cache expires every 12 min, will update 5 times an hour. Arbitrary
      const isExpired = moment(latest.date_pinned).isBefore(
        moment().subtract({ minutes: 12 }),
      )

      if (isExpired) {
        setCache(null)
      } else {
        // Get data from latest cache if not expired
        axios.get(ipfsCidUrl(latest.ipfs_pin_hash)).then(cache => {
          setCache(
            cache.data.projects.map((p: any) => ({
              ...p,
              id: BigNumber.from(p.id),
              currentBalance: BigNumber.from(p.currentBalance),
              totalPaid: BigNumber.from(p.totalPaid),
              trendingScore: BigNumber.from(p.trendingScore),
              trendingVolume: BigNumber.from(p.trendingVolume),
              totalRedeemed: BigNumber.from(p.totalRedeemed),
            })) ?? [],
          )
        })
      }

      // Unpin any remaining cache files. If latest is not expired don't unpin it
      // There should never be more than one cache file, but simultaneous page views may result in multiple
      for (let i = isExpired ? 0 : 1; i < res.count; i++) {
        // We use await here to help avoid simultaenous requests being rate limited
        await unpinIpfsFileByCid(res.rows[i].ipfs_pin_hash)
      }
    })
  }, [])

  return cache
}

// Returns projects with highest % volume increase in last week
export function useTrendingProjects(count: number, days: number) {
  const [loadingPayments, setLoadingPayments] = useState<boolean>()
  const [projectStats, setProjectStats] = useState<
    Record<
      string,
      {
        trendingVolume: BigNumber
        paymentsCount: number
      }
    >
  >()

  const cache = useTrendingProjectsCache()

  const shouldRefreshCache = cache === null

  console.log(
    shouldRefreshCache ? 'Trending cache expired' : 'Using trending cache',
    cache,
  )

  useEffect(() => {
    const loadPayments = async () => {
      setLoadingPayments(true)

      const daySeconds = days * SECONDS_IN_DAY
      const now = new Date().setUTCHours(0, 0, 0, 0) // get start of day, for determinism
      const nowSeconds = now.valueOf() / 1000

      const payments = await querySubgraphExhaustive({
        entity: 'payEvent',
        keys: [
          'amount',
          {
            entity: 'project',
            keys: ['id'],
          },
        ],
        where: [
          {
            key: 'timestamp',
            value: nowSeconds - daySeconds,
            operator: 'gte',
          },
        ],
      })

      // Project data mapped trending data calculated from payments
      setProjectStats(
        (payments ?? []).reduce(
          (acc, curr) => {
            const projectId = curr.project.id?.toString()

            return projectId
              ? {
                  ...acc,
                  [projectId]: {
                    trendingVolume: BigNumber.from(
                      acc[projectId]?.trendingVolume ?? 0,
                    ).add(curr.amount),
                    paymentsCount: (acc[projectId]?.paymentsCount ?? 0) + 1,
                  },
                }
              : acc
          },
          {} as Record<
            string,
            {
              trendingVolume: BigNumber
              paymentsCount: number
            }
          >,
        ),
      )

      setLoadingPayments(false)
    }

    if (shouldRefreshCache) loadPayments()
  }, [count, days, shouldRefreshCache])

  // Query project data for all trending project IDs
  const projectsQuery = useSubgraphQuery(
    projectStats && shouldRefreshCache
      ? {
          entity: 'project',
          keys,
          where: {
            key: 'id',
            value: Object.keys(projectStats),
            operator: 'in',
          },
        }
      : null,
  )

  const trendingProjectsQuery = {
    ...projectsQuery,
    isLoading:
      projectsQuery.isLoading || loadingPayments || cache === undefined,
    // Return TrendingProjects sorted by `trendingScore`
    data: projectsQuery.data
      ?.map(p => {
        const stats =
          p.id && projectStats ? projectStats[p.id.toString()] : undefined

        // Algorithm to rank trending projects:
        // trendingScore = volume * (number of payments)^2
        const trendingScore = stats?.trendingVolume.mul(
          BigNumber.from(stats.paymentsCount).pow(2),
        )

        return {
          ...p,
          trendingScore,
          trendingVolume: stats?.trendingVolume,
          trendingPaymentsCount: stats?.paymentsCount,
        } as TrendingProject
      })
      .sort((a, b) => (a.trendingScore?.gt(b.trendingScore ?? 0) ? -1 : 1))
      .slice(0, count),
  }

  if (trendingProjectsQuery.data?.length && shouldRefreshCache) {
    console.log('Uploading new trending cache', trendingProjectsQuery.data)
    uploadTrendingProjectsCache(trendingProjectsQuery.data).then(() =>
      console.log('Uploaded new trending cache'),
    )
  }

  return shouldRefreshCache
    ? trendingProjectsQuery
    : {
        data: cache,
        isLoading: false,
      }
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
          const projectId = curr?.project?.id?.toString()

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
          keys,
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

export function useInfiniteProjectsQuery(opts: ProjectsOptions) {
  return useInfiniteSubgraphQuery(
    queryOpts(opts) as InfiniteGraphQueryOpts<'project', EntityKeys<'project'>>,
    { staleTime },
  )
}
