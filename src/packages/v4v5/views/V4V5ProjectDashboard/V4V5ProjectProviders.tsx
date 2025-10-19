import { JBChainId, JBProjectProvider } from 'juice-sdk-react'
import React, { PropsWithChildren } from 'react'

import { AppWrapper } from 'components/common/CoreAppWrapper/CoreAppWrapper'
import { OPEN_IPFS_GATEWAY_HOSTNAME } from 'constants/ipfs'
import ProjectOFACProvider from 'contexts/ProjectOFACProvider'
import store from 'packages/v4v5/components/ProjectDashboard/redux/store'
import { ReduxProjectCartProvider } from 'packages/v4v5/components/ProjectDashboard/ReduxProjectCartProvider'
import { V4V5NftRewardsProvider } from 'packages/v4v5/contexts/V4V5NftRewards/V4V5NftRewardsProvider'
import V4V5ProjectMetadataProvider from 'packages/v4v5/contexts/V4V5ProjectMetadataProvider'
import { V4V5UserNftCreditsProvider } from 'packages/v4v5/contexts/V4V5UserNftCreditsProvider'
import { V4V5UserTotalTokensBalanceProvider } from 'packages/v4v5/contexts/V4V5UserTotalTokensBalanceProvider'
import { useV4V5Version } from 'packages/v4v5/contexts/V4V5VersionProvider'
import { CyclesPanelSelectedChainProvider } from 'packages/v4v5/views/V4V5ProjectDashboard/V4V5ProjectTabs/V4V5CyclesPayoutsPanel/contexts/CyclesPanelSelectedChainContext'
import { Provider } from 'react-redux'

const V4V5ProjectProviders: React.FC<
  PropsWithChildren & { chainId: JBChainId; projectId: bigint }
> = ({ chainId, projectId, children }) => {
  const { version } = useV4V5Version()

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
    <AppWrapper txHistoryProvider="wagmi">
      <JBProjectProvider
        chainId={chainId}
        projectId={projectId}
        version={version}
        bendystraw={bendystrawConfig}
        ctxProps={{
          metadata: { ipfsGatewayHostname: OPEN_IPFS_GATEWAY_HOSTNAME },
        }}
      >
        <V4V5ProjectMetadataProvider projectId={projectId}>
          <ProjectOFACProvider isV4>
            <Provider store={store}>
              <V4V5UserNftCreditsProvider>
                <V4V5UserTotalTokensBalanceProvider>
                  <V4V5NftRewardsProvider>
                    <CyclesPanelSelectedChainProvider>
                      <ReduxProjectCartProvider>
                        {children}
                      </ReduxProjectCartProvider>
                    </CyclesPanelSelectedChainProvider>
                  </V4V5NftRewardsProvider>
                </V4V5UserTotalTokensBalanceProvider>
              </V4V5UserNftCreditsProvider>
            </Provider>
          </ProjectOFACProvider>
        </V4V5ProjectMetadataProvider>
      </JBProjectProvider>
    </AppWrapper>
  )
}

export default V4V5ProjectProviders
