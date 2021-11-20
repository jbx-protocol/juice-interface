import {
  EntityKey,
  formatGraphQuery,
  GraphQueryOpts,
  SubgraphQueryReturnTypes,
} from '../utils/graph'
import { useQuery, UseQueryOptions } from 'react-query'
import axios from 'axios'

const subgraphUrl = process.env.REACT_APP_SUBGRAPH_URL

export default function useSubgraphQuery<E extends EntityKey>(
  opts: GraphQueryOpts<E>,
  reactQueryOptions?: UseQueryOptions<
    SubgraphQueryReturnTypes[E],
    unknown, // Specific error type?
    SubgraphQueryReturnTypes[E],
    [string, GraphQueryOpts<E>]
  >,
) {
  if (!subgraphUrl) {
    throw new Error('env.REACT_APP_SUBGRAPH_URL is missing')
  }
  return useQuery(
    ['subgraph-query', opts],
    async () => {
      const response = await axios.post(
        subgraphUrl,
        {
          query: formatGraphQuery(opts),
        },
        { headers: { 'Content-Type': 'application/json' } },
      )

      return response.data?.data as SubgraphQueryReturnTypes[E]
    },
    reactQueryOptions,
  )
}
