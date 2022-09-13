import { V3ProjectContext } from 'contexts/v3/projectContext'
import { useV3ProjectState } from 'hooks/v3/V3ProjectState'
import { ProjectMetadataV4 } from 'models/project-metadata'
import { PropsWithChildren } from 'react'

export default function V3ProjectProvider({
  projectId,
  metadata,
  children,
}: PropsWithChildren<{
  projectId: number
  metadata: ProjectMetadataV4
}>) {
  const project = useV3ProjectState({ projectId, metadata })

  return (
    <V3ProjectContext.Provider value={project}>
      {children}
    </V3ProjectContext.Provider>
  )
}
