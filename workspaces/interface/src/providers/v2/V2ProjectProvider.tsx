import { V2ProjectContext } from 'contexts/v2/projectContext'
import { useV2ProjectState } from 'hooks/v2/V2ProjectState'
import { ProjectMetadataV4 } from 'models/project-metadata'
import { PropsWithChildren } from 'react'

export default function V2ProjectProvider({
  projectId,
  metadata,
  children,
}: PropsWithChildren<{
  projectId: number
  metadata: ProjectMetadataV4
}>) {
  const project = useV2ProjectState({ projectId, metadata })

  return (
    <V2ProjectContext.Provider value={project}>
      {children}
    </V2ProjectContext.Provider>
  )
}
