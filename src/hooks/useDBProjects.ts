import {
  UseInfiniteQueryOptions,
  UseQueryOptions,
  useInfiniteQuery,
  useQuery,
} from '@tanstack/react-query'
import axios from 'axios'
import { DBProject, DBProjectQueryOpts, DBProjectRow } from 'models/dbProject'
import { Json } from 'models/json'
import { useMemo } from 'react'
import { formatQueryParams } from 'utils/queryParams'
import { parseDBProject, parseDBProjectJson } from 'utils/sgDbProjects'

const DEFAULT_STALE_TIME = 60 * 1000 // 60 seconds

export function useDBProjectsQuery(
  opts: DBProjectQueryOpts | null,
  reactQueryOptions?: Partial<
    UseQueryOptions<
      DBProject[],
      Error,
      DBProject[],
      readonly [string, DBProjectQueryOpts | null]
    >
  >,
) {
  return useQuery<
    DBProject[],
    Error,
    DBProject[],
    readonly [string, DBProjectQueryOpts | null]
  >({
    queryKey: ['dbp-query', opts],
    queryFn: () =>
      opts
        ? axios
            .get<Json<DBProjectRow>[]>(
              `/api/projects?${formatQueryParams(opts)}`,
            )
            .then(res => res.data?.map(parseDBProject))
        : Promise.resolve([] as DBProject[]),
    staleTime: DEFAULT_STALE_TIME,
    ...reactQueryOptions,
  })
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
  return useInfiniteQuery({
    queryKey: ['dbp-infinite-query', opts],
    queryFn: async ({ queryKey, pageParam }) => {
      const { pageSize, ...evaluatedOpts } = queryKey[1]

      const res = await axios.get<DBProjectRow[] | undefined>(
        `/api/projects?${formatQueryParams({
          ...evaluatedOpts,
          page: (pageParam as number) ?? 0,
          pageSize,
        })}`,
      )

      return res?.data?.map(parseDBProject) ?? []
    },
    initialPageParam: 0,
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
    // somehow fixes a typescript issue where 'pages' isnt on 'data' object.
    select: data => ({
      pages: [...data.pages],
    }),
  })
}

export const DEFAULT_TRENDING_PROJECTS_LIMIT = 10

export function useTrendingProjects(count: number) {
  return useQuery({
    queryKey: ['trending-projects', count],
    queryFn: async () => {
      const res = await axios.get<Json<DBProject>[]>(
        '/api/projects/trending?count=' + count,
      )

      return res.data.map(parseDBProjectJson)
    },
  })
}

export function useProjectTrendingPercentageIncrease({
  totalVolume,
  trendingVolume,
}: {
  totalVolume: bigint
  trendingVolume: bigint
}): number {
  const percentageGain = useMemo(() => {
    const preTrendingVolume = totalVolume && totalVolume - trendingVolume

    if (!(preTrendingVolume && preTrendingVolume > 0n)) return Infinity

    const percentGain = Number((trendingVolume * 10000n) / preTrendingVolume)

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
