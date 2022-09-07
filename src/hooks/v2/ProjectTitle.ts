import { V2ProjectContext } from 'contexts/v2/projectContext'
import { useContext } from 'react'

export function useV2ProjectTitle() {
  const { handle, projectMetadata } = useContext(V2ProjectContext)

  return handle ? `@${handle}` : projectMetadata?.name ?? 'project'
}
