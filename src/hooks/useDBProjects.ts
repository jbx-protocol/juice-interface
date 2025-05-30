import {
  UseInfiniteQueryOptions,
  UseQueryOptions,
  useInfiniteQuery,
  useQuery,
} from '@tanstack/react-query'
import axios from 'axios'
import {
  DBProjectQueryOpts,
  DBProjectsAggregate,
  DBProjectsAggregateRow
} from 'models/dbProject'
import { formatQueryParams } from 'utils/queryParams'
import { parseDBProjectsAggregate } from 'utils/sgDbProjects'

const DEFAULT_STALE_TIME = 60 * 1000 // 60 seconds

export function useDBProjectsAggregateQuery(
  opts: DBProjectQueryOpts | null,
  reactQueryOptions?: Partial<
    UseQueryOptions<
      DBProjectsAggregate[],
      Error,
      DBProjectsAggregate[],
      readonly [string, DBProjectQueryOpts | null]
    >
  >,
) {
  return useQuery<
    DBProjectsAggregate[],
    Error,
    DBProjectsAggregate[],
    readonly [string, DBProjectQueryOpts | null]
  >({
    queryKey: ['dbp-query', opts],
    queryFn: () =>
      opts
        ? axios
            .get<DBProjectsAggregateRow[]>(
              `/api/projects?${formatQueryParams(opts)}`,
            )
            .then(res => res.data?.map(parseDBProjectsAggregate))
        : Promise.resolve([] as DBProjectsAggregate[]),
    staleTime: DEFAULT_STALE_TIME,
    ...reactQueryOptions,
  })
}

export function useDBProjectsAggregateInfiniteQuery(
  opts: DBProjectQueryOpts,
  reactQueryOptions?: UseInfiniteQueryOptions<
    DBProjectsAggregate[],
    Error,
    DBProjectsAggregate[],
    DBProjectsAggregate[],
    readonly [string, DBProjectQueryOpts]
  >,
) {
  return useInfiniteQuery({
    queryKey: ['dbp-infinite-query', opts],
    queryFn: async ({ queryKey, pageParam }) => {
      const { pageSize, ...evaluatedOpts } = queryKey[1]

      const res = await axios.get<DBProjectsAggregateRow[] | undefined>(
        `/api/projects?${formatQueryParams({
          ...evaluatedOpts,
          page: (pageParam as number) ?? 0,
          pageSize,
        })}`,
      )

      return res?.data?.map(parseDBProjectsAggregate) ?? []
    },
    initialPageParam: 0,
    staleTime: DEFAULT_STALE_TIME,
    ...reactQueryOptions,
    // Don't allow this function to be overwritten by reactQueryOptions
    getNextPageParam: (lastPage, allPages) => {
      // If the last page contains less than the expected page size,
      // it's safe to assume you're at the end.
      if (opts.pageSize && lastPage.length < opts.pageSize) {
        return undefined
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
