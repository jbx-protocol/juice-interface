import { V1ProjectContext } from 'contexts/v1/projectContext'
import { useV1ProjectState } from 'hooks/v1/V1ProjectState'
import { ProjectMetadataV5 } from 'models/project-metadata'

export const V1ProjectProvider: React.FC<{
  handle: string
  metadata: ProjectMetadataV5
}> = ({ children, handle, metadata }) => {
  const project = useV1ProjectState({ handle, metadata })

  return (
    <V1ProjectContext.Provider value={project}>
      {children}
    </V1ProjectContext.Provider>
  )
}
