import { JUICY_PICKS_PROJECT_IDS } from 'components/Home/JuicyPicksSection/constants'
import { PV_V2 } from 'constants/pv'
import { useProjectsQuery } from 'generated/graphql'
import { client } from 'lib/apollo/client'
import { getSubgraphIdForProject } from 'utils/graph'

export function useFetchJuicyPicks() {
  return useProjectsQuery({
    client,
    variables: {
      where: {
        id_in: JUICY_PICKS_PROJECT_IDS.map(projectId =>
          getSubgraphIdForProject(PV_V2, projectId),
        ),
      },
    },
  })
}
