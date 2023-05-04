import { ArcxAnalyticsSdk } from '@arcxmoney/analytics'
import { readNetwork } from 'constants/networks'
import { useWallet } from 'hooks/Wallet'
import { getArcxClient } from 'lib/arcx'
import { useEffect, useRef } from 'react'
import { ArcxContext } from './ArcxContext'

export const ArcxProvider: React.FC = ({ children }) => {
  const arcx = useRef<ArcxAnalyticsSdk | undefined>()
  const { userAddress } = useWallet()

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
