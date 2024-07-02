import { ProjectMetadataContext } from 'contexts/ProjectMetadataContext'
import { useContext } from 'react'
import useOwnerOfProject from './useOwnerOfProject'

export function useProjectOwner() {
  const { projectId } = useContext(ProjectMetadataContext)

  const owner = useOwnerOfProject(projectId)

  return { owner }
}
