import { ArcxAnalyticsSdk } from '@arcxmoney/analytics'
import { readNetwork } from 'constants/networks'
import { ArcxContext } from 'contexts/ArcxContext'
import { useUserAddress } from 'hooks/Wallet/hooks'
import { getArcxClient } from 'lib/arcx'
import { useEffect, useRef } from 'react'

export const ArcxProvider: React.FC = ({ children }) => {
  const arcx = useRef<ArcxAnalyticsSdk | undefined>()
  const userAddress = useUserAddress()

  useEffect(() => {
    getArcxClient().then(arcxClient => {
      arcx.current = arcxClient
    })
  }, [])

  useEffect(() => {
    if (!userAddress) return

    arcx.current?.connectWallet({
      account: userAddress,
      chain: readNetwork.chainId,
    })
  }, [userAddress])

  return (
    <ArcxContext.Provider value={arcx.current}>{children}</ArcxContext.Provider>
  )
}
