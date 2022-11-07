import { ProjectMetadataV5 } from 'models/project-metadata'
import { PV } from 'models/pv'
import { createContext } from 'react'

interface ProjectMetadataContextType {
  projectMetadata: ProjectMetadataV5 | undefined
  isArchived: boolean | undefined
  projectId: number | undefined
  pv: PV | undefined
}

export const ProjectMetadataContext = createContext<ProjectMetadataContextType>(
  {
    projectMetadata: undefined,
    isArchived: undefined,
    projectId: undefined,
    pv: undefined,
  },
)
