import { V1ProjectContext } from 'contexts/v1/projectContext'
import { useContext } from 'react'

import useOwnerOfProject from './OwnerOfProject'

export function useGetProjectOwner() {
  const { projectId } = useContext(V1ProjectContext)
  const owner = useOwnerOfProject(projectId)

  return { owner }
}
