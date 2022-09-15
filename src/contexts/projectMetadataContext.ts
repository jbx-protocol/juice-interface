import { ProjectMetadataV4 } from 'models/project-metadata'
import { createContext } from 'react'

export interface ProjectMetadataContextType {
  projectMetadata: ProjectMetadataV4 | undefined
  isArchived: boolean | undefined
}

export const ProjectMetadataContext = createContext<ProjectMetadataContextType>(
  {
    projectMetadata: undefined,
    isArchived: undefined,
  },
)
