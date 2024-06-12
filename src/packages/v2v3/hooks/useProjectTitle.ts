import { ProjectMetadataContext } from 'contexts/ProjectMetadataContext'
import { V2V3ProjectContext } from 'packages/v2v3/contexts/Project/V2V3ProjectContext'
import { useContext } from 'react'

export function useV2ProjectTitle() {
  const { projectMetadata } = useContext(ProjectMetadataContext)
  const { handle } = useContext(V2V3ProjectContext)

  return handle ? `@${handle}` : projectMetadata?.name ?? 'project'
}
