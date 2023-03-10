import { useQwestiveSDK } from './QwestiveReferral'
import { SDKContext } from './QwestiveReferralContext'

const QwestiveSDKContextProvider: React.FC = ({ children }) => {
  const scriptContext = useQwestiveSDK()
  return (
    <SDKContext.Provider value={scriptContext}>{children}</SDKContext.Provider>
  )
}

export default QwestiveSDKContextProvider
