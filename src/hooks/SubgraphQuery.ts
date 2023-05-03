import axios from 'axios'
import {
  InfiniteSGQueryOpts,
  SGEntity,
  SGEntityKey,
  SGEntityName,
  SGError,
  SGQueryOpts,
  SGResponseData,
} from 'models/graph'
import {
  UseInfiniteQueryOptions,
  UseQueryOptions,
  useInfiniteQuery,
  useQuery,
} from 'react-query'

import {
  entitiesFromSGResponse,
  formatGraphQuery,
  parseSubgraphEntity,
  querySubgraph,
} from '../utils/graph'

const staleTime = 60 * 1000 // 60 seconds

// This looks up the entity type and constructs an object
// only with the keys you specified in K.
type GraphResult<E extends SGEntityName, K extends SGEntityKey<E>> = {
  [PropertyKey in K]: SGEntity<E>[PropertyKey]
}[]

// Pass `opts = null` to prevent http request
export default function useSubgraphQuery<
  E extends SGEntityName,
  K extends SGEntityKey<E>,
>(
  opts: SGQueryOpts<E, K> | null,
  reactQueryOptions?: UseQueryOptions<
    GraphResult<E, K>,
    Error,
    GraphResult<E, K>,
    readonly [string, SGQueryOpts<E, K> | null]
  >,
) {
  return useQuery<
    GraphResult<E, K>,
    Error,
    GraphResult<E, K>,
    readonly [string, SGQueryOpts<E, K> | null]
  >(['subgraph-query', opts], () => querySubgraph(opts), {
    staleTime,
    ...reactQueryOptions,
  })
}

/**
 * Queries a list of subgraph entities, with support for appending data from subsequent pages to the returned array of entities.
 */
export function useInfiniteSubgraphQuery<
  E extends SGEntityName,
  K extends SGEntityKey<E>,
>(
  opts: InfiniteSGQueryOpts<E, K>,
  reactQueryOptions?: UseInfiniteQueryOptions<
    GraphResult<E, K>,
    Error,
    GraphResult<E, K>,
    GraphResult<E, K>,
    readonly [string, InfiniteSGQueryOpts<E, K>]
  >,
) {
  const subgraphUrl =
    process.env.NEXT_SUBGRAPH_URL ?? process.env.NEXT_PUBLIC_SUBGRAPH_URL

  if (!subgraphUrl) throw new Error('Subgraph URL is missing from .env')

  return useInfiniteQuery<
    GraphResult<E, K>,
    Error,
    GraphResult<E, K>,
    readonly [string, InfiniteSGQueryOpts<E, K>]
  >(
    ['infinite-subgraph-query', opts] as const,
    async ({ queryKey, pageParam = 0 }) => {
      const { pageSize, ...evaluatedOpts } = queryKey[1]

      const response = await axios.post<{
        errors?: SGError[]
        data: SGResponseData<E, K>
      }>(
        subgraphUrl,
        {
          query: formatGraphQuery<E, K>({
            ...evaluatedOpts,
            skip: pageSize * pageParam,
            first: pageSize,
          }),
        },
        { headers: { 'Content-Type': 'application/json' } },
      )

      if ('errors' in response.data) {
        throw new Error(
          response.data.errors?.[0]?.message ||
            'Something is wrong with this Graph request',
        )
      }

      return entitiesFromSGResponse(opts.entity, response.data?.data).map(e =>
        parseSubgraphEntity(opts.entity, e),
      )
    },
    {
      staleTime,
      ...reactQueryOptions,

      // Don't allow this function to be overwritten by reactQueryOptions
      getNextPageParam: (lastPage, allPages) => {
        // If the last page contains less than the expected page size,
        // it's safe to assume you're at the end.
        if (lastPage.length < opts.pageSize) {
          return false
        } else {
          return allPages.length
        }
      },
    },
  )
}
