import useSubgraphQuery from 'hooks/SubgraphQuery'

export const useOurMissionSession = () => {
  const { data: protocolLogs, isLoading } = useSubgraphQuery({
    entity: 'protocolLog',
    keys: ['volumePaidUSD'],
  })

  const volumePaidUSD = protocolLogs?.[0]?.volumePaidUSD

  return {
    volumePaidUSD,
    isLoading,
  }
}
