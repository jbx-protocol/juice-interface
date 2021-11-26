import {
  EntityKey,
  EntityKeys,
  formatGraphQuery,
  formatGraphResponse,
  GraphQueryOpts,
  SubgraphEntities,
  SubgraphQueryReturnTypes,
} from '../utils/graph'
import { useQuery, UseQueryOptions } from 'react-query'
import axios from 'axios'

const subgraphUrl = process.env.REACT_APP_SUBGRAPH_URL

// This looks up the entity type and constructs an object
// only with the keys you specified in K.
type GraphResult<E extends EntityKey, K extends EntityKeys<E>[]> = {
  [PropertyKey in K[number]]: SubgraphEntities[E][PropertyKey]
}[]

export default function useSubgraphQuery<
  E extends EntityKey,
  K extends EntityKeys<E>
>(
  opts: GraphQueryOpts<E, K>,
  reactQueryOptions?: UseQueryOptions<
    GraphResult<E, K[]>,
    unknown, // Specific error type?
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
    unknown, // Specific error type?
    GraphResult<E, K[]>,
    readonly [string, GraphQueryOpts<E, K>]
  >(
    ['subgraph-query', opts],
    async () => {
      const response = await axios.post<{ data: SubgraphQueryReturnTypes[E] }>(
        subgraphUrl,
        {
          query: formatGraphQuery(opts),
        },
        { headers: { 'Content-Type': 'application/json' } },
      )

      return formatGraphResponse(opts.entity, response.data?.data)
    },
    {
      staleTime: 60000,
      ...reactQueryOptions,
    },
  )
}
