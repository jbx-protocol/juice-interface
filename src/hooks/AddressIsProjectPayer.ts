import useSubgraphQuery from 'hooks/SubgraphQuery'

export function useAddressIsProjectPayer(address: string | undefined) {
  return useSubgraphQuery(
    address
      ? {
          entity: 'etherc20ProjectPayer',
          where: {
            key: 'address',
            value: address,
          },
          keys: [{ entity: 'project', keys: ['id', 'cv', 'handle'] }],
        }
      : null,
  )
}
