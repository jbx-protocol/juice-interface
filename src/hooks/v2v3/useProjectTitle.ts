import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import { useContext } from 'react'

export function useV2ProjectTitle() {
  const { projectMetadata } = useContext(ProjectMetadataContext)
  const { handle } = useContext(V2V3ProjectContext)

  return handle ? `@${handle}` : projectMetadata?.name ?? 'project'
}
