import { JUICY_PICKS_PROJECT_IDS } from 'components/Home/JuicyPicksSection/constants'
import { PV_V2 } from 'constants/pv'
import { useDBProjectsQuery } from 'hooks/useProjects'
import { DBProject } from 'models/dbProject'
import { getSubgraphIdForProject } from 'utils/graph'

export function useFetchJuicyPicks() {
  const res = useDBProjectsQuery({
    ids: JUICY_PICKS_PROJECT_IDS.map(projectId =>
      getSubgraphIdForProject(PV_V2, projectId),
    ),
  })

  if (!res.data) {
    return res
  }

  // ensure list sorted by JUICY_PICKS_PROJECT_IDS array order
  const sortedPicks = JUICY_PICKS_PROJECT_IDS.map(projectId => {
    return res.data?.find(project => project.projectId === projectId) as
      | DBProject
      | undefined
  }).filter((p): p is DBProject => !!p)

  return {
    ...res,
    data: sortedPicks,
  }
}
