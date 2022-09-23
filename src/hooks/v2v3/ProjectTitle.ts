import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { V2V3ProjectContext } from 'contexts/v2v3/V2V3ProjectContext'
import { useContext } from 'react'

export function useV2ProjectTitle() {
  const { projectMetadata } = useContext(ProjectMetadataContext)
  const { handle } = useContext(V2V3ProjectContext)

  return handle ? `@${handle}` : projectMetadata?.name ?? 'project'
}
