import { AppWrapper } from 'components/common/CoreAppWrapper/CoreAppWrapper'
import { OPEN_IPFS_GATEWAY_HOSTNAME } from 'constants/ipfs'
import { TransactionProvider } from 'contexts/Transaction/TransactionProvider'
import { jbUrn } from 'juice-sdk-core'
import { JBProjectProvider } from 'juice-sdk-react'
import { useRouter } from 'next/router'
import { Provider } from 'react-redux'
import store from 'redux/store'
import { EditCycleFormProvider } from '../views/V4V5ProjectSettings/EditCyclePage/EditCycleFormContext'
import { V4V5NftRewardsProvider } from './V4V5NftRewards/V4V5NftRewardsProvider'
import V4V5ProjectMetadataProvider from './V4V5ProjectMetadataProvider'
import { V4V5VersionProvider } from './V4V5VersionProvider'

interface V4V5SettingsProviderProps extends React.PropsWithChildren {
  version?: 4 | 5
}

export const V4V5SettingsProvider: React.FC<V4V5SettingsProviderProps> = ({
  children,
  version = 4, // Default to v4 for backwards compatibility
}) => {
  const router = useRouter()
  const { projectId, chainId } = jbUrn(router.query.jbUrn as string) ?? {}
  if (!projectId || !chainId) {
    return null
  }
  return (
    <AppWrapper hideNav>
      <V4V5VersionProvider
        chainId={chainId}
        projectId={Number(projectId)}
        defaultVersion={version}
      >
        <JBProjectProvider
          chainId={chainId}
          projectId={projectId}
          version={version}
          bendystraw={{
            apiKey: '',
          }}
          ctxProps={{
            metadata: { ipfsGatewayHostname: OPEN_IPFS_GATEWAY_HOSTNAME },
          }}
        >
          <V4V5NftRewardsProvider>
            <V4V5ProjectMetadataProvider projectId={projectId}>
              <Provider store={store}>
                <TransactionProvider>
                  <EditCycleFormProvider>{children}</EditCycleFormProvider>
                </TransactionProvider>
              </Provider>
            </V4V5ProjectMetadataProvider>
          </V4V5NftRewardsProvider>
        </JBProjectProvider>
      </V4V5VersionProvider>
    </AppWrapper>
  )
}
