import useSubgraphQuery from 'hooks/SubgraphQuery'

export function useDistributePayoutsEvents({ id }: { id: string | undefined }) {
  const { data: distributePayoutsEvents } = useSubgraphQuery({
    entity: 'distributeToPayoutSplitEvent',
    keys: [
      'id',
      'timestamp',
      'txHash',
      'amount',
      'beneficiary',
      'splitProjectId',
    ],
    orderDirection: 'desc',
    orderBy: 'amount',
    where: id
      ? {
          key: 'distributePayoutsEvent',
          value: id,
        }
      : undefined,
  })
  return distributePayoutsEvents
}
