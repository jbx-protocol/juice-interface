import { PV_V1, PV_V2 } from 'constants/pv'
import { V1ArchivedProjectIds } from 'constants/v1/archivedProjects'
import { V2ArchivedProjectIds } from 'constants/v2v3/archivedProjects'
import { PV } from 'models/pv'

/**
 * Returns true if a projectId is archived per the hard-coded archived lists
 */
export function isHardArchived({
  pv,
  projectId,
}: {
  pv: PV
  projectId: number
}) {
  return (
    (pv === PV_V1 && V1ArchivedProjectIds.includes(projectId)) ||
    (pv === PV_V2 && V2ArchivedProjectIds.includes(projectId))
  )
}
