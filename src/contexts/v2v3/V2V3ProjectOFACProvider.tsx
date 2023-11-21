import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react'

import axios from 'axios'

import { useWallet } from 'hooks/Wallet'

import { ProjectOFACContext } from 'contexts/shared/ProjectOFACContext'
import { useProjectMetadata } from 'components/v2v3/V2V3Project/ProjectDashboard/hooks'

import { OFAC_API } from 'constants/links'

export default function V2V3ProjectOFACProvider({
  children,
}: {
  children?: ReactNode
}) {
  const { userAddress, isConnected } = useWallet()
  const { projectMetadata } = useProjectMetadata()

  const [isAddressListedInOFAC, setIsListed] = useState<boolean | undefined>()

  const shouldCheckOfac = useMemo(() => {
    return projectMetadata?.projectRequiredOFACCheck && isConnected
  }, [projectMetadata?.projectRequiredOFACCheck, isConnected])

  const checkIsAddressListedInOFAC = useCallback(
    async (address: string) => {
      try {
        const { data } = await axios.get<{ isGoodAddress: boolean }>(
          `${OFAC_API}?address=${address}`,
        )
        setIsListed(!data.isGoodAddress)
      } catch (err) {
        setIsListed(true)
      }
    },
    [setIsListed],
  )

  useEffect(() => {
    if (shouldCheckOfac && userAddress) {
      checkIsAddressListedInOFAC(userAddress)
    }
    // unexpected dependency checkIsAddressListedInOFAC
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldCheckOfac, userAddress])

  return (
    <ProjectOFACContext.Provider value={{ isAddressListedInOFAC }}>
      {children}
    </ProjectOFACContext.Provider>
  )
}
