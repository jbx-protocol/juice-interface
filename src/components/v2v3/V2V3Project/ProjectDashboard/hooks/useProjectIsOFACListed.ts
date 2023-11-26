import { useContext } from 'react'

import { ProjectOFACContext } from 'contexts/shared/ProjectOFACContext'

export const useProjectOFACContext = () => useContext(ProjectOFACContext)
