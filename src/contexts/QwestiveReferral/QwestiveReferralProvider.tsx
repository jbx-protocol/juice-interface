import { useWallet } from 'hooks/Wallet'
import { useEffect } from 'react'
import { SDKContext } from './QwestiveReferralContext'
import { useQwestiveSDKProvider } from './useQwestiveReferral'

const QwestiveSDKContextProvider: React.FC<
  React.PropsWithChildren<unknown>
> = ({ children }) => {
  const { userAddress } = useWallet()
  const scriptContext = useQwestiveSDKProvider()

  useEffect(() => {
    if (!userAddress || scriptContext.qwestiveTracker.isLoading) return
    scriptContext.qwestiveTracker?.setReferral?.({
      publicKey: userAddress,
    })
  }, [userAddress, scriptContext.qwestiveTracker])

  return (
    <SDKContext.Provider value={scriptContext}>{children}</SDKContext.Provider>
  )
}

export default QwestiveSDKContextProvider
