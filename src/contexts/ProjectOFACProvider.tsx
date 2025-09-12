import { ReactNode, createContext } from 'react'

import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useWallet } from 'hooks/Wallet'
import { useJBProjectMetadataContext } from 'juice-sdk-react'

interface ProjectOFACContextType {
  isLoading?: boolean
  isAddressListedInOFAC?: boolean | null
}

export const ProjectOFACContext = createContext<ProjectOFACContextType>({
  isLoading: false,
  isAddressListedInOFAC: undefined,
})

export default function ProjectOFACProvider({
  ofacEnabled,
  isV4,
  children,
}: {
  ofacEnabled?: boolean,
  isV4?: boolean,
  children?: ReactNode,
}) {
  const { userAddress, isConnected } = useWallet()
  
  // v4 metadata only
  const { metadata } = useJBProjectMetadataContext()

  const _ofacEnabled = isV4 ? metadata?.data?.projectRequiredOFACCheck : ofacEnabled
  
  const enabled = _ofacEnabled && isConnected 

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
