import { AppWrapper } from 'components/common/CoreAppWrapper/CoreAppWrapper'
import { OPEN_IPFS_GATEWAY_HOSTNAME } from 'constants/ipfs'
import { TransactionProvider } from 'contexts/Transaction/TransactionProvider'
import { JBProjectProvider } from 'juice-sdk-react'
import { useRouter } from 'next/router'
import { Provider } from 'react-redux'
import store from 'redux/store'
import { WagmiProvider } from 'wagmi'
import { chainNameMap } from '../utils/networks'
import { EditCycleFormProvider } from '../views/V4ProjectSettings/EditCyclePage/EditCycleFormContext'
import { wagmiConfig } from '../wagmiConfig'
import V4ProjectMetadataProvider from './V4ProjectMetadataProvider'

export const V4SettingsProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const router = useRouter()

  const { projectId: rawProjectId, chainName } = router.query
  if (!rawProjectId) return null

  const projectId = parseInt(rawProjectId as string)
  const projectIdBigInt = BigInt(projectId)
  const chainId = chainNameMap[chainName as string]

  return (
    <AppWrapper hideNav>
      <WagmiProvider config={wagmiConfig}>
        <JBProjectProvider
          chainId={chainId}
          projectId={projectIdBigInt}
          ctxProps={{
            metadata: { ipfsGatewayHostname: OPEN_IPFS_GATEWAY_HOSTNAME },
          }}
        >
          <V4ProjectMetadataProvider projectId={projectIdBigInt}>
            <Provider store={store}>
              <TransactionProvider>
                <EditCycleFormProvider>
                  {children}
                </EditCycleFormProvider>
              </TransactionProvider>
            </Provider>
          </V4ProjectMetadataProvider>
        </JBProjectProvider>
      </WagmiProvider>
    </AppWrapper>
  )
}
