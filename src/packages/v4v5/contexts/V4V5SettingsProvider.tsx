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

  // Only use API key for localhost. JBM domains (juicebox.money, sepolia.juicebox.money) are whitelisted.
  const isLocalhost =
    typeof window !== 'undefined' && window.location.hostname === 'localhost'
  const bendystrawFullUrl =
    process.env.NEXT_PUBLIC_TESTNET === 'true'
      ? process.env.NEXT_PUBLIC_BENDYSTRAW_TESTNET_URL
      : process.env.NEXT_PUBLIC_BENDYSTRAW_URL

  // Parse URL to extract base URL and API key
  const urlParts = bendystrawFullUrl?.split('/') ?? []
  const bendystrawUrl = urlParts.slice(0, 3).join('/') // https://testnet.bendystraw.xyz or https://bendystraw.xyz
  const bendystrawApiKey = urlParts[3] ?? '' // API key from path

  const bendystrawConfig = isLocalhost && bendystrawApiKey
    ? { apiKey: bendystrawApiKey, url: bendystrawUrl } // Localhost: pass both API key and URL
    : { apiKey: '' } // Production (whitelisted domains): just empty API key, no URL

  return (
    <AppWrapper hideNav>
      <JBProjectProvider
        chainId={chainId as JBChainId}
        projectId={projectId}
        version={version}
        bendystraw={bendystrawConfig}
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
