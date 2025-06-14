import { ReactNode, createContext } from 'react'

import axios from 'axios'
import { useProjectMetadataContext } from 'contexts/ProjectMetadataContext'
import { useQuery } from '@tanstack/react-query'
import { useWallet } from 'hooks/Wallet'

interface ProjectOFACContextType {
  isLoading?: boolean
  isAddressListedInOFAC?: boolean | null
}

export const ProjectOFACContext = createContext<ProjectOFACContextType>({
  isLoading: false,
  isAddressListedInOFAC: undefined,
})

export default function ProjectOFACProvider({
  children,
}: {
  children?: ReactNode
}) {
  const { userAddress, isConnected } = useWallet()
  const { projectMetadata } = useProjectMetadataContext()

  const enabled = projectMetadata?.projectRequiredOFACCheck && isConnected

  const { data: isAddressListedInOFAC, isLoading } = useQuery({
    queryKey: ['isAddressListedInOFAC', userAddress],
    queryFn: async () => {
      if (!enabled) {
        return null
      }

      try {
        const { data } = await axios.get<{ isGoodAddress: boolean }>(
          `/api/ofac/validate/${userAddress}`,
        )

        return !data.isGoodAddress
      } catch (e) {
        console.warn(e)
        /**
         * If the request fails, we assume the address is listed in OFAC.
         * A bad actor could block or otherwise cause the request to fail.
         */
        return true
      }
    },
    enabled,
  })

  return (
    <ProjectOFACContext.Provider value={{ isAddressListedInOFAC, isLoading }}>
      {children}
    </ProjectOFACContext.Provider>
  )
}
