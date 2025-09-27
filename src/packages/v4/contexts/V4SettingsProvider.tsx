import { AppWrapper } from 'components/common/CoreAppWrapper/CoreAppWrapper'
import { OPEN_IPFS_GATEWAY_HOSTNAME } from 'constants/ipfs'
import { TransactionProvider } from 'contexts/Transaction/TransactionProvider'
import { jbUrn } from 'juice-sdk-core'
import { JBProjectProvider } from 'juice-sdk-react'
import { useRouter } from 'next/router'
import { Provider } from 'react-redux'
import store from 'redux/store'
import { EditCycleFormProvider } from '../views/V4ProjectSettings/EditCyclePage/EditCycleFormContext'
import { V4NftRewardsProvider } from './V4NftRewards/V4NftRewardsProvider'
import V4ProjectMetadataProvider from './V4ProjectMetadataProvider'

export const V4SettingsProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const router = useRouter()
  const { projectId, chainId } = jbUrn(router.query.jbUrn as string) ?? {}
  if (!projectId || !chainId) {
    return null
  }
  return (
    <AppWrapper hideNav>
      <JBProjectProvider
        chainId={chainId}
        projectId={projectId}
        version={4}
        bendystraw={{
          apiKey: '',
        }}
        ctxProps={{
          metadata: { ipfsGatewayHostname: OPEN_IPFS_GATEWAY_HOSTNAME },
        }}
      >
        <V4NftRewardsProvider>
          <V4ProjectMetadataProvider projectId={projectId}>
            <Provider store={store}>
              <TransactionProvider>
                <EditCycleFormProvider>{children}</EditCycleFormProvider>
              </TransactionProvider>
            </Provider>
          </V4ProjectMetadataProvider>
        </V4NftRewardsProvider>
      </JBProjectProvider>
    </AppWrapper>
  )
}
