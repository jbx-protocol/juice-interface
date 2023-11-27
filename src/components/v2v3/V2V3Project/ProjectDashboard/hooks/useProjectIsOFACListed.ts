import { ProjectOFACContext } from 'contexts/shared/ProjectOFACContext'
import { useContext } from 'react'

export const useProjectIsOFACListed = () => useContext(ProjectOFACContext)
