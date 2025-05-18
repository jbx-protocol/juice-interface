import { type TypedDocumentNode } from '@graphql-typed-document-node/core'
import { useQuery, type UseQueryResult } from '@tanstack/react-query'
import request from 'graphql-request'
import { JBChainId, useJBChainId, useSuckers } from 'juice-sdk-react'
import { v4SubgraphUri } from 'lib/apollo/subgraphUri'

export function useOmnichainSubgraphQuery<TResult, TVariables>(
  document: TypedDocumentNode<TResult, TVariables>,
  ...[variables]: TVariables extends Record<string, never> ? [] : [TVariables]
): UseQueryResult<
  { status: string; value: { response: TResult; chainId: JBChainId } }[]
> {
  const chainId = useJBChainId()
  const { data: suckers } = useSuckers()

  const resolvedSubgraphUrls =
    suckers && suckers.length > 0
      ? suckers.map(s => {
          return [s.peerChainId, v4SubgraphUri(parseInt(s.peerChainId))]
        })
      : chainId
      ? [[chainId, v4SubgraphUri(chainId)]]
      : []

  return useQuery({
    queryKey: [
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (document.definitions[0] as any).name.value,
      variables,
      resolvedSubgraphUrls.map(c => c[0]).join(','),
    ],
    queryFn: async ({ queryKey }) => {
      return Promise.allSettled(
        resolvedSubgraphUrls.map(async ([chainId, url]) => {
          if (!url) {
            throw new Error('No subgraph url for chain: ' + chainId)
          }

          /**
           * Patch in projectId for the current chainId
           */
          const projectId = suckers?.find(
            suckerPair => suckerPair.peerChainId === parseInt(chainId),
          )?.projectId
          const _queryKey = [...queryKey]
          if (
            projectId &&
            _queryKey[1].where &&
            'projectId' in _queryKey[1].where
          ) {
            _queryKey[1].where.projectId = projectId
          }

          const response = await request(
            url,
            document,
            _queryKey[1] ? _queryKey[1] : undefined,
          )

          return {
            chainId,
            response,
          }
        }),
      )
    },
  })
}
