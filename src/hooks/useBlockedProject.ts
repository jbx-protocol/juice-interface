import { BLOCKED_PROJECT_IDS } from 'constants/blocklist'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { useContext } from 'react'

export const useBlockedProject = () => {
  const { projectId } = useContext(ProjectMetadataContext)
  const isBlockedProject = projectId
    ? BLOCKED_PROJECT_IDS.includes(projectId?.toString())
    : false
  return isBlockedProject
}
