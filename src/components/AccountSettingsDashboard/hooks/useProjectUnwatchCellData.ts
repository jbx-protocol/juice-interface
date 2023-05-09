import useSubgraphQuery from 'hooks/useSubgraphQuery'

/**
 * Fetches project data from the subgraph, using the project id as a key.
 * @param projectId The project id to fetch data for.
 * @returns The project data.
 */
export const useProjectUnwatchCellData = ({
  projectId,
}: {
  projectId: number
}) => {
  const res = useSubgraphQuery({
    entity: 'project',
    keys: ['id', 'handle', 'metadataUri'],
    where: [
      {
        key: 'projectId',
        value: projectId,
      },
      {
        key: 'pv',
        value: '2',
      },
    ],
  }).data
  return res?.[0]
}
