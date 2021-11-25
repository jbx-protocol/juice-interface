import {
  EntityKey,
  formatGraphQuery,
  formatGraphResponse,
  GraphQueryOpts,
  SubgraphEntities,
  SubgraphQueryReturnTypes,
} from '../utils/graph'
import { useQuery, UseQueryOptions } from 'react-query'
import axios from 'axios'

const subgraphUrl = process.env.REACT_APP_SUBGRAPH_URL

export default function useSubgraphQuery<E extends EntityKey>(
  opts: GraphQueryOpts<E>,
  reactQueryOptions?: UseQueryOptions<
    SubgraphEntities[E][],
    unknown, // Specific error type?
    SubgraphEntities[E][],
    readonly [string, GraphQueryOpts<E>]
  >,
) {
  if (!subgraphUrl) {
    // This should _only_ happen in development
    throw new Error('env.REACT_APP_SUBGRAPH_URL is missing')
  }
  return useQuery<
    SubgraphEntities[E][],
    unknown, // Specific error type?
    SubgraphEntities[E][],
    readonly [string, GraphQueryOpts<E>]
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
