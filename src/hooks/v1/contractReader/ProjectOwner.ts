import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { useContext } from 'react'
import useOwnerOfProject from './OwnerOfProject'

export function useProjectOwner() {
  const { projectId } = useContext(ProjectMetadataContext)

  const owner = useOwnerOfProject(projectId)

  return { owner }
}
