import { CV } from 'models/cv'
import { ProjectMetadataV5 } from 'models/project-metadata'
import { createContext } from 'react'

interface ProjectMetadataContextType {
  projectMetadata: ProjectMetadataV5 | undefined
  isArchived: boolean | undefined
  projectId: number | undefined
  cv: CV | undefined
}

export const ProjectMetadataContext = createContext<ProjectMetadataContextType>(
  {
    projectMetadata: undefined,
    isArchived: undefined,
    projectId: undefined,
    cv: undefined,
  },
)
