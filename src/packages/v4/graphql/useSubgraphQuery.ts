import { type TypedDocumentNode } from '@graphql-typed-document-node/core'
import { useQuery, type UseQueryResult } from '@tanstack/react-query'
import request from 'graphql-request'
import { useJBChainId } from 'juice-sdk-react'
import { v4SubgraphUri } from 'lib/apollo/subgraphUri'

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt
// @ts-ignore
BigInt.prototype.toJSON = function () {
  return { $bigint: this.toString() }
}

export function useSubgraphQuery<TResult, TVariables>({
  document,
  enabled = true,
  variables,
}: {
  document: TypedDocumentNode<TResult, TVariables>
  enabled?: boolean
  variables?: TVariables
}): UseQueryResult<TResult> {
  const chainId = useJBChainId()
  return useQuery({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    queryKey: [(document.definitions[0] as any).name.value, variables],
    queryFn: async ({ queryKey }) => {
      if (!chainId) {
        throw new Error('useSubgraphQuery needs a chainId, none provided')
      }
      const uri = v4SubgraphUri(chainId)

      return request(uri, document, queryKey[1] ? queryKey[1] : undefined)
    },
    enabled,
  })
}
