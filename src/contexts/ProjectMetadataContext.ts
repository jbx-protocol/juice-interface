import { ProjectMetadata } from 'models/projectMetadata'
import { PV } from 'models/pv'
import { createContext, useContext } from 'react'

interface ProjectMetadataContextType {
  projectMetadata: ProjectMetadata | undefined
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

export const useProjectMetadataContext = () =>
  useContext(ProjectMetadataContext)
