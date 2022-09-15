import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { V2ProjectContext } from 'contexts/v2/projectContext'
import { useContext } from 'react'

export function useV2ProjectTitle() {
  const { projectMetadata } = useContext(ProjectMetadataContext)
  const { handle } = useContext(V2ProjectContext)

  return handle ? `@${handle}` : projectMetadata?.name ?? 'project'
}
