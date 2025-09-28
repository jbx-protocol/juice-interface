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
import { Provider } from 'react-redux'

const V4V5ProjectProviders: React.FC<
  PropsWithChildren & { chainId: JBChainId; projectId: bigint }
> = ({ chainId, projectId, children }) => {
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
        <V4V5ProjectMetadataProvider projectId={projectId}>
          <ProjectOFACProvider isV4>
            <Provider store={store}>
              <V4V5UserNftCreditsProvider>
                <V4V5UserTotalTokensBalanceProvider>
                  <V4V5NftRewardsProvider>
                    <ReduxProjectCartProvider>
                      {children}
                    </ReduxProjectCartProvider>
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