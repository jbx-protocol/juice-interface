import { AppWrapper } from 'components/common/CoreAppWrapper/CoreAppWrapper'
import { OPEN_IPFS_GATEWAY_HOSTNAME } from 'constants/ipfs'
import { TransactionProvider } from 'contexts/Transaction/TransactionProvider'
import { JBChainId, jbUrn } from 'juice-sdk-core'
import { JBProjectProvider } from 'juice-sdk-react'
import { useRouter } from 'next/router'
import { Provider } from 'react-redux'
import store from 'redux/store'
import { EditCycleFormProvider } from '../views/V4V5ProjectSettings/EditCyclePage/EditCycleFormContext'
import { V4V5NftRewardsProvider } from './V4V5NftRewards/V4V5NftRewardsProvider'
import V4V5ProjectMetadataProvider from './V4V5ProjectMetadataProvider'
import { useV4V5Version } from './V4V5VersionProvider'

export const V4V5SettingsProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const router = useRouter()
  const { version } = useV4V5Version()
  const { projectId, chainId } = jbUrn(router.query.jbUrn as string) ?? {}

  if (!projectId || !chainId) {
    return null
  }

  return (
    <AppWrapper hideNav>
      <JBProjectProvider
        chainId={chainId as JBChainId}
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
    </AppWrapper>
  )
}
