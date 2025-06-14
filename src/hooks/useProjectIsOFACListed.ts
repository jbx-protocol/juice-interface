import { ProjectOFACContext } from 'contexts/ProjectOFACProvider'
import { useContext } from 'react'

export const useProjectIsOFACListed = () => useContext(ProjectOFACContext)
