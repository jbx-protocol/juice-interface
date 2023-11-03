import { useProjectMetadata } from 'components/v2v3/V2V3Project/ProjectDashboard/hooks'
import { PV_V2 } from 'constants/pv'
import { getSubgraphIdForProject } from 'utils/graph'

export const useFactoredProjectId = () => {
  const { projectId } = useProjectMetadata()
  const project = projectId
    ? getSubgraphIdForProject(PV_V2, projectId)
    : undefined

  return project
}
