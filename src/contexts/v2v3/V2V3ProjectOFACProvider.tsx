import axios from 'axios'
import { useProjectMetadata } from 'components/v2v3/V2V3Project/ProjectDashboard/hooks/useProjectMetadata'
import { useWallet } from 'hooks/Wallet'
import { ReactNode, createContext } from 'react'
import { useQuery } from 'react-query'

const OFAC_API = 'https://api.wewantjusticedao.org/donation/validate'

interface ProjectOFACContextType {
  isAddressListedInOFAC?: boolean
}

export const ProjectOFACContext = createContext<ProjectOFACContextType>({
  isAddressListedInOFAC: undefined,
})

export default function V2V3ProjectOFACProvider({
  children,
}: {
  children?: ReactNode
}) {
  const { userAddress, isConnected } = useWallet()
  const { projectMetadata } = useProjectMetadata()

  const { data: isAddressListedInOFAC } = useQuery(
    ['isAddressListedInOFAC', userAddress],
    async () => {
      if (!(projectMetadata?.projectRequiredOFACCheck && isConnected)) {
        return
      }

      try {
        const { data } = await axios.get<{ isGoodAddress: boolean }>(
          `${OFAC_API}?address=${userAddress}`,
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
  )

  return (
    <ProjectOFACContext.Provider value={{ isAddressListedInOFAC }}>
      {children}
    </ProjectOFACContext.Provider>
  )
}
