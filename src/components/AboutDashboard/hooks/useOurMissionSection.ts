import useSubgraphQuery from 'hooks/useSubgraphQuery'

export const useOurMissionSession = () => {
  const { data: protocolLogs, isLoading } = useSubgraphQuery({
    entity: 'protocolLog',
    keys: ['volumeUSD'],
  })

  const volumeUSD = protocolLogs?.[0]?.volumeUSD

  return {
    volumeUSD,
    isLoading,
  }
}
