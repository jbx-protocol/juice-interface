import useSubgraphQuery from 'hooks/SubgraphQuery'

export const useVeNftContractForProject = (projectId: number | undefined) => {
  return useSubgraphQuery({
    entity: 'veNftContract',
    keys: ['address', 'uriResolver'],
    where: [
      {
        key: 'projectId',
        value: projectId || '',
      },
    ],
  })
}
