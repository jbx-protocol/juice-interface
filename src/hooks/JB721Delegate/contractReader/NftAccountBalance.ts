import useSubgraphQuery from 'hooks/SubgraphQuery'

/**
 * Return all the project's NFTs that are owned by the given account.
 */
export function useNftAccountBalance({
  dataSourceAddress,
  accountAddress,
}: {
  dataSourceAddress: string | undefined
  accountAddress: string | undefined
}) {
  return useSubgraphQuery({
    entity: 'jb721DelegateToken',
    keys: ['tokenId', 'address', 'tokenUri'],
    where: [
      {
        key: 'address',
        value: dataSourceAddress ?? '',
      },
      {
        key: 'owner',
        value: `{ wallet: "${accountAddress ?? ''}" }`,
        nested: true,
      },
    ],
  })
}
