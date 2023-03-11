import { useQwestiveSDKProvider } from './QwestiveReferral'
import { SDKContext } from './QwestiveReferralContext'

const QwestiveSDKContextProvider: React.FC = ({ children }) => {
  const scriptContext = useQwestiveSDKProvider()
  return (
    <SDKContext.Provider value={scriptContext}>{children}</SDKContext.Provider>
  )
}

export default QwestiveSDKContextProvider
