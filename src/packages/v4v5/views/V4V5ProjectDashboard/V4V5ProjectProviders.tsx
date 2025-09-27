import { JBChainId, JBProjectProvider, useJBProjectMetadataContext } from 'juice-sdk-react'
import React, { PropsWithChildren } from 'react'

import { AppWrapper } from 'components/common/CoreAppWrapper/CoreAppWrapper'
import { OPEN_IPFS_GATEWAY_HOSTNAME } from 'constants/ipfs'
import ProjectOFACProvider from 'contexts/ProjectOFACProvider'
import store from 'packages/v4v5/components/ProjectDashboard/redux/store'
import { ReduxProjectCartProvider } from 'packages/v4v5/components/ProjectDashboard/ReduxProjectCartProvider'
import { V4NftRewardsProvider } from 'packages/v4v5/contexts/V4NftRewards/V4NftRewardsProvider'
import V4ProjectMetadataProvider from 'packages/v4v5/contexts/V4ProjectMetadataProvider'
import { V4UserNftCreditsProvider } from 'packages/v4v5/contexts/V4UserNftCreditsProvider'
import { V4UserTotalTokensBalanceProvider } from 'packages/v4v5/contexts/V4UserTotalTokensBalanceProvider'
import { V4V5VersionProvider, useV4V5Version } from 'packages/v4v5/contexts/V4V5VersionProvider'
import { Provider } from 'react-redux'

const V4V5ProjectProvidersInner: React.FC<
  PropsWithChildren & { chainId: JBChainId; projectId: bigint }
> = ({ chainId, projectId, children }) => {
  const { metadata } = useJBProjectMetadataContext()
  const { version } = useV4V5Version()

  return (
    <AppWrapper txHistoryProvider="wagmi">
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
        <V4ProjectMetadataProvider projectId={projectId}>
          <ProjectOFACProvider isV4>
            <Provider store={store}>
              <V4UserNftCreditsProvider>
                <V4UserTotalTokensBalanceProvider>
                  <V4NftRewardsProvider>
                    <ReduxProjectCartProvider>
                      {children}
                    </ReduxProjectCartProvider>
                  </V4NftRewardsProvider>
                </V4UserTotalTokensBalanceProvider>
              </V4UserNftCreditsProvider>
            </Provider>
          </ProjectOFACProvider>
        </V4ProjectMetadataProvider>
      </JBProjectProvider>
    </AppWrapper>
  )
}

const V4V5ProjectProviders: React.FC<
  PropsWithChildren & { chainId: JBChainId; projectId: bigint; defaultVersion?: 4 | 5 }
> = ({ chainId, projectId, defaultVersion = 4, children }) => {
  return (
    <V4V5VersionProvider chainId={chainId} projectId={Number(projectId)} defaultVersion={defaultVersion}>
      <V4V5ProjectProvidersInner chainId={chainId} projectId={projectId}>
        {children}
      </V4V5ProjectProvidersInner>
    </V4V5VersionProvider>
  )
}

export default V4V5ProjectProviders