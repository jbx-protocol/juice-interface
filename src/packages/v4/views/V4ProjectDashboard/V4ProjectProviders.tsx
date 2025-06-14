import { JBChainId, JBProjectProvider } from 'juice-sdk-react'
import React, { PropsWithChildren } from 'react'

import { AppWrapper } from 'components/common/CoreAppWrapper/CoreAppWrapper'
import { OPEN_IPFS_GATEWAY_HOSTNAME } from 'constants/ipfs'
import ProjectOFACProvider from 'contexts/ProjectOFACProvider'
import { Provider } from 'react-redux'
import { ReduxProjectCartProvider } from 'packages/v4/components/ProjectDashboard/ReduxProjectCartProvider'
import { V4NftRewardsProvider } from 'packages/v4/contexts/V4NftRewards/V4NftRewardsProvider'
import V4ProjectMetadataProvider from 'packages/v4/contexts/V4ProjectMetadataProvider'
import { V4UserNftCreditsProvider } from 'packages/v4/contexts/V4UserNftCreditsProvider'
import { V4UserTotalTokensBalanceProvider } from 'packages/v4/contexts/V4UserTotalTokensBalanceProvider'
import store from 'packages/v4/components/ProjectDashboard/redux/store'

const V4ProjectProviders: React.FC<
  PropsWithChildren & { chainId: JBChainId; projectId: bigint }
> = ({ chainId, projectId, children }) => {
  return (
    <AppWrapper txHistoryProvider="wagmi">
      <JBProjectProvider
        chainId={chainId}
        projectId={projectId}
        ctxProps={{
          metadata: { ipfsGatewayHostname: OPEN_IPFS_GATEWAY_HOSTNAME },
        }}
      >
        <V4ProjectMetadataProvider projectId={projectId}>
          <ProjectOFACProvider>
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
export default V4ProjectProviders
