import { PV_V2 } from 'constants/pv'
import {
  DEFAULT_PROJECT_ENTITY_KEYS,
  useProjectsQuery,
} from 'hooks/useProjects'
import { Project } from 'models/subgraph-entities/vX/project'
import { JUICY_PICKS_PROJECT_IDS } from '../constants'

export function useFetchJuicyPicks() {
  const res = useProjectsQuery({
    keys: [...DEFAULT_PROJECT_ENTITY_KEYS, 'paymentsCount', 'trendingVolume'],
    projectIds: JUICY_PICKS_PROJECT_IDS,
    pv: [PV_V2],
  })

  if (!res.data) {
    return res
  }

  // ensure list sorted by JUICY_PICKS_PROJECT_IDS array order
  const sortedPicks = JUICY_PICKS_PROJECT_IDS.map(projectId => {
    return res.data?.find(project => project.projectId === projectId) as
      | Project
      | undefined
  }).filter((p): p is Project => !!p)

  return {
    ...res,
    data: sortedPicks,
  }
}
