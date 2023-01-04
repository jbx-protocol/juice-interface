import useSubgraphQuery from 'hooks/SubgraphQuery'

/**
 * Return all the project's NFTs minted for the given address.
 */
export function useNftCollectionTokens({
  dataSourceAddress,
}: {
  dataSourceAddress: string | undefined
}) {
  return useSubgraphQuery({
    entity: 'jb721DelegateToken',
    keys: ['tokenId', 'address', 'tokenUri'],
    where: [
      {
        key: 'address',
        value: dataSourceAddress ?? '',
      },
    ],
    first: 1000,
  })
}
