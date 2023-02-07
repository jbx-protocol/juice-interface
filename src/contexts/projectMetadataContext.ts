import { ProjectMetadataV6 } from 'models/project-metadata'
import { PV } from 'models/pv'
import { createContext } from 'react'

interface ProjectMetadataContextType {
  projectMetadata: ProjectMetadataV6 | undefined
  isArchived: boolean | undefined
  projectId: number | undefined
  pv: PV | undefined
  refetchProjectMetadata: VoidFunction
}

export const ProjectMetadataContext = createContext<ProjectMetadataContextType>(
  {
    projectMetadata: undefined,
    isArchived: undefined,
    projectId: undefined,
    pv: undefined,
    refetchProjectMetadata: () =>
      console.error(
        'ProjectMetadataContext.refetchProjectMetadata called but no provider set',
      ),
  },
)
