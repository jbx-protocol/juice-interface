import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { V1ProjectContext } from 'contexts/v1/Project/V1ProjectContext'
import { useContext } from 'react'

export function useV1ProjectTitle() {
  const { handle } = useContext(V1ProjectContext)
  const { projectMetadata } = useContext(ProjectMetadataContext)

  return handle ? `@${handle}` : projectMetadata?.name ?? 'project'
}
