import axios from 'axios'
import {
  useQuery,
  useInfiniteQuery,
  UseInfiniteQueryOptions,
  UseQueryOptions,
} from 'react-query'

import {
  EntityKey,
  EntityKeys,
  formatGraphQuery,
  formatGraphResponse,
  GraphQueryOpts,
  InfiniteGraphQueryOpts,
  SubgraphEntities,
  SubgraphError,
  SubgraphQueryReturnTypes,
} from '../utils/graph'

const subgraphUrl = process.env.REACT_APP_SUBGRAPH_URL

// This looks up the entity type and constructs an object
// only with the keys you specified in K.
type GraphResult<E extends EntityKey, K extends EntityKeys<E>[]> = {
  [PropertyKey in K[number]]: SubgraphEntities[E][PropertyKey]
}[]

export default function useSubgraphQuery<
  E extends EntityKey,
  K extends EntityKeys<E>,
>(
  opts: GraphQueryOpts<E, K>,
  reactQueryOptions?: UseQueryOptions<
    GraphResult<E, K[]>,
    Error,
    GraphResult<E, K[]>,
    readonly [string, GraphQueryOpts<E, K>]
  >,
) {
  if (!subgraphUrl) {
    // This should _only_ happen in development
    throw new Error('env.REACT_APP_SUBGRAPH_URL is missing')
  }
  return useQuery<
    GraphResult<E, K[]>,
    Error,
    GraphResult<E, K[]>,
    readonly [string, GraphQueryOpts<E, K>]
  >(
    ['subgraph-query', opts],
    async () => {
      const response = await axios.post<{
        errors?: SubgraphError[]
        data: SubgraphQueryReturnTypes[E]
      }>(
        subgraphUrl,
        {
          query: formatGraphQuery(opts),
        },
        { headers: { 'Content-Type': 'application/json' } },
      )

      if ('errors' in response.data) {
        throw new Error(
          response.data.errors?.[0]?.message ||
            'Something is wrong with this Graph request',
        )
      }

      return formatGraphResponse(opts.entity, response.data?.data)
    },
    {
      staleTime: 60000,
      ...reactQueryOptions,
    },
  )
}

export function useInfiniteSubgraphQuery<
  E extends EntityKey,
  K extends EntityKeys<E>,
>(
  opts: InfiniteGraphQueryOpts<E, K>,
  reactQueryOptions?: UseInfiniteQueryOptions<
    GraphResult<E, K[]>,
    Error,
    GraphResult<E, K[]>,
    GraphResult<E, K[]>,
    readonly [string, InfiniteGraphQueryOpts<E, K>]
  >,
) {
  if (!subgraphUrl) {
    // This should _only_ happen in development
    throw new Error('env.REACT_APP_SUBGRAPH_URL is missing')
  }
  return useInfiniteQuery<
    GraphResult<E, K[]>,
    Error,
    GraphResult<E, K[]>,
    readonly [string, InfiniteGraphQueryOpts<E, K>]
  >(
    ['infinite-subgraph-query', opts] as const,
    async ({ queryKey, pageParam = 0 }) => {
      const { pageSize, ...evaluatedOpts } = queryKey[1]
      const response = await axios.post<{
        errors?: SubgraphError[]
        data: SubgraphQueryReturnTypes[E]
      }>(
        subgraphUrl,
        {
          query: formatGraphQuery({
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

      return formatGraphResponse(opts.entity, response.data?.data)
    },
    {
      staleTime: 60000,
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
