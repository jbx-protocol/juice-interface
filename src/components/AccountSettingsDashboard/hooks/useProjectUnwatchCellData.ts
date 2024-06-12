import { PV_V2 } from 'constants/pv'
import { useProjectsQuery } from 'generated/graphql'
import { client } from 'lib/apollo/client'
import { SubgraphQueryProject } from 'models/subgraphProjects'

/**
 * Fetches project data from the subgraph, using the project id as a key.
 * @param projectId The project id to fetch data for.
 * @returns The project data.
 */
export const useProjectUnwatchCellData = ({
  projectId,
}: {
  projectId: number
}): SubgraphQueryProject | undefined => {
  const { data } = useProjectsQuery({
    client,
    variables: {
      where: {
        projectId,
        pv: PV_V2,
      },
    },
  })

  return data?.projects[0]
}
