import { createContext } from 'react'

interface ProjectOFACContextType {
  isAddressListedInOFAC?: boolean
}

export const ProjectOFACContext = createContext<ProjectOFACContextType>({
  isAddressListedInOFAC: undefined,
})
