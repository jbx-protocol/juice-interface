import { PV_V2 } from 'constants/pv'
import { useProjectsQuery } from 'hooks/Projects'
import { JUICY_PICKS_PROJECT_IDS } from '../constants'

export function useFetchJuicyPicks() {
  return useProjectsQuery({
    projectIds: JUICY_PICKS_PROJECT_IDS,
    pv: [PV_V2],
  })
}
