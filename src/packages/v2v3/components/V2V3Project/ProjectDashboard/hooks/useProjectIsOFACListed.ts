import { ProjectOFACContext } from 'packages/v2v3/contexts/V2V3ProjectOFACProvider'
import { useContext } from 'react'

export const useProjectIsOFACListed = () => useContext(ProjectOFACContext)
