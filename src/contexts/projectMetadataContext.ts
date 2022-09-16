import { CV } from 'models/cv'
import { ProjectMetadataV4 } from 'models/project-metadata'
import { createContext } from 'react'

export interface ProjectMetadataContextType {
  projectMetadata: ProjectMetadataV4 | undefined
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
