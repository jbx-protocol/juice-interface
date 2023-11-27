import { ProjectOFACContext } from 'contexts/v2v3/V2V3ProjectOFACProvider'
import { useContext } from 'react'

export const useProjectIsOFACListed = () => useContext(ProjectOFACContext)
