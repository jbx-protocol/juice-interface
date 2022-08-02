import useSubgraphQuery from 'hooks/SubgraphQuery'

export function useProjectPayers(projectId: number | undefined) {
  return useSubgraphQuery(
    projectId
      ? {
          entity: 'etherc20ProjectPayer',
          where: {
            key: 'projectId',
            value: projectId,
          },
          keys: [
            'address',
            'beneficiary',
            'directory',
            'memo',
            'metadata',
            'preferAddToBalance',
            'preferClaimedTokens',
          ],
        }
      : null,
  )
}
