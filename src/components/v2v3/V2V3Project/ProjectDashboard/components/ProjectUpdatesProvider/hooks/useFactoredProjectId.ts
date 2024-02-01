import { PV_V2 } from 'constants/pv'
import { useProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { getSubgraphIdForProject } from 'utils/graph'

export const useFactoredProjectId = () => {
  const { projectId } = useProjectMetadataContext()
  const project = projectId
    ? getSubgraphIdForProject(PV_V2, projectId)
    : undefined

  return project
}
