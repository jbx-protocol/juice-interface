import { useWallet } from 'hooks/Wallet'
import { useEffect } from 'react'
import { useQwestiveSDKProvider } from './QwestiveReferral'
import { SDKContext } from './QwestiveReferralContext'

const QwestiveSDKContextProvider: React.FC = ({ children }) => {
  const { userAddress } = useWallet()
  const scriptContext = useQwestiveSDKProvider()

  useEffect(() => {
    if (!userAddress) return

    scriptContext.qwestiveTracker?.setAlias?.({
      id: userAddress,
    })
  }, [userAddress, scriptContext.qwestiveTracker])

  return (
    <SDKContext.Provider value={scriptContext}>{children}</SDKContext.Provider>
  )
}

export default QwestiveSDKContextProvider
