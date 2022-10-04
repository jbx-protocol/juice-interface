import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { V1ProjectContext } from 'contexts/v1/projectContext'
import { useContext } from 'react'

export function useV1ProjectTitle() {
  const { handle } = useContext(V1ProjectContext)
  const { projectMetadata } = useContext(ProjectMetadataContext)

  return handle ? `@${handle}` : projectMetadata?.name ?? 'project'
}
