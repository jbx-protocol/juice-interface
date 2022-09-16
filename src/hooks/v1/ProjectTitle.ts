import { V1ProjectContext } from 'contexts/v1/projectContext'
import { useContext } from 'react'

export function useV1ProjectTitle() {
  const { handle, metadata } = useContext(V1ProjectContext)

  return handle ? `@${handle}` : metadata?.name ?? 'project'
}
