import axios from 'axios'
import { BigNumber } from 'ethers'
import { DBProject, DBProjectQueryOpts, DBProjectRow } from 'models/dbProject'
import { Json } from 'models/json'
import { useMemo } from 'react'
import {
  UseInfiniteQueryOptions,
  UseQueryOptions,
  useInfiniteQuery,
  useQuery,
} from 'react-query'
import { formatQueryParams } from 'utils/queryParams'
import { parseDBProject, parseDBProjectJson } from 'utils/sgDbProjects'

const DEFAULT_STALE_TIME = 60 * 1000 // 60 seconds

export function useDBProjectsQuery(
  opts: DBProjectQueryOpts | null,
  reactQueryOptions?: UseQueryOptions<
    DBProject[],
    Error,
    DBProject[],
    readonly [string, DBProjectQueryOpts | null]
  >,
) {
  return useQuery<
    DBProject[],
    Error,
    DBProject[],
    readonly [string, DBProjectQueryOpts | null]
  >(
    ['dbp-query', opts],
    () =>
      opts
        ? axios
            .get<Json<DBProjectRow>[]>(
              `/api/projects?${formatQueryParams(opts)}`,
            )
            .then(res => res.data?.map(parseDBProject))
        : Promise.resolve([] as DBProject[]),
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
        .get<DBProjectRow[] | undefined>(
          `/api/projects?${formatQueryParams({
            ...evaluatedOpts,
            page: pageParam ?? 0,
            pageSize,
          })}`,
        )
        .then(res => (res.data ? res.data.map(parseDBProject) : []))
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

export const DEFAULT_TRENDING_PROJECTS_LIMIT = 10

export function useTrendingProjects(count: number) {
  return useQuery(['trending-projects', count], async () => {
    const res = await axios.get<Json<DBProject>[]>(
      '/api/projects/trending?count=' + count,
    )

    return res.data.map(parseDBProjectJson)
  })
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
