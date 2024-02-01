import axios from 'axios'
import { useProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { useWallet } from 'hooks/Wallet'
import { ReactNode, createContext } from 'react'
import { useQuery } from 'react-query'

interface ProjectOFACContextType {
  isLoading?: boolean
  isAddressListedInOFAC?: boolean
}

export const ProjectOFACContext = createContext<ProjectOFACContextType>({
  isLoading: false,
  isAddressListedInOFAC: undefined,
})

export default function V2V3ProjectOFACProvider({
  children,
}: {
  children?: ReactNode
}) {
  const { userAddress, isConnected } = useWallet()
  const { projectMetadata } = useProjectMetadataContext()

  const enabled = projectMetadata?.projectRequiredOFACCheck && isConnected

  const { data: isAddressListedInOFAC, isLoading } = useQuery(
    ['isAddressListedInOFAC', userAddress],
    async () => {
      if (!enabled) {
        return
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
    { enabled },
  )

  return (
    <ProjectOFACContext.Provider value={{ isAddressListedInOFAC, isLoading }}>
      {children}
    </ProjectOFACContext.Provider>
  )
}
