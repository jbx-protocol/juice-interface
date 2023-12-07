import { V2_BLOCKLISTED_PROJECT_IDS } from 'constants/blocklist'
import { PV_V2 } from 'constants/pv'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { useContext } from 'react'

export const useV2V3BlockedProject = () => {
  const { projectId, pv } = useContext(ProjectMetadataContext)
  const isBlockedProject = projectId
    ? V2_BLOCKLISTED_PROJECT_IDS.includes(projectId) && pv === PV_V2
    : false

  return isBlockedProject
}
