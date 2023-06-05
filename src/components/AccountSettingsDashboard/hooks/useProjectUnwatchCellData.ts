import { PV_V2 } from 'constants/pv'
import { useDBProjectsQuery } from 'hooks/useProjects'

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
  const { data } = useDBProjectsQuery({
    projectId,
    pv: [PV_V2],
  })

  return data?.[0]
}
