import { AppWrapper } from 'components/common/CoreAppWrapper/CoreAppWrapper'
import { OPEN_IPFS_GATEWAY_HOSTNAME } from 'constants/ipfs'
import { TransactionProvider } from 'contexts/Transaction/TransactionProvider'
import { JBProjectProvider } from 'juice-sdk-react'
import { useRouter } from 'next/router'
import { Provider } from 'react-redux'
import store from 'redux/store'
import { WagmiProvider } from 'wagmi'
import { useCurrentRouteChainId } from '../hooks/useCurrentRouteChainId'
import { EditCycleFormProvider } from '../views/V4ProjectSettings/EditCyclePage/EditCycleFormContext'
import { wagmiConfig } from '../wagmiConfig'
import { V4NftRewardsProvider } from './V4NftRewards/V4NftRewardsProvider'
import V4ProjectMetadataProvider from './V4ProjectMetadataProvider'

export const V4SettingsProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const router = useRouter()
  const chainId = useCurrentRouteChainId()

  const { projectId: rawProjectId } = router.query
  if (!rawProjectId) return null

  const projectId = parseInt(rawProjectId as string)
  const projectIdBigInt = BigInt(projectId)

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
          <V4NftRewardsProvider>
            <V4ProjectMetadataProvider projectId={projectIdBigInt}>
              <Provider store={store}>
                <TransactionProvider>
                  <EditCycleFormProvider>{children}</EditCycleFormProvider>
                </TransactionProvider>
              </Provider>
            </V4ProjectMetadataProvider>
          </V4NftRewardsProvider>
        </JBProjectProvider>
      </WagmiProvider>
    </AppWrapper>
  )
}
