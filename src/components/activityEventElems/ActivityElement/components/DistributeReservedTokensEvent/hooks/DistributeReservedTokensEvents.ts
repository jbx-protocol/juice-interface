import useSubgraphQuery from 'hooks/SubgraphQuery'

export function useDistributeReservedTokensEvents({
  id,
}: {
  id: string | undefined
}) {
  const { data: distributeReservedTokensEvents } = useSubgraphQuery(
    {
      entity: 'distributeToReservedTokenSplitEvent',
      keys: [
        'id',
        'timestamp',
        'txHash',
        'beneficiary',
        'tokenCount',
        'projectId',
      ],
      orderDirection: 'desc',
      orderBy: 'tokenCount',
      where: id
        ? {
            key: 'distributeReservedTokensEvent',
            value: id,
          }
        : undefined,
    },
    {},
  )
  return distributeReservedTokensEvents
}
