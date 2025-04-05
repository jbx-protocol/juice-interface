import { AppWrapper } from 'components/common/CoreAppWrapper/CoreAppWrapper'
import { OPEN_IPFS_GATEWAY_HOSTNAME } from 'constants/ipfs'
import { JBChainId, JBProjectProvider } from 'juice-sdk-react'
import { ReduxProjectCartProvider } from 'packages/v4/components/ProjectDashboard/ReduxProjectCartProvider'
import store from 'packages/v4/components/ProjectDashboard/redux/store'
import { V4NftRewardsProvider } from 'packages/v4/contexts/V4NftRewards/V4NftRewardsProvider'
import V4ProjectMetadataProvider from 'packages/v4/contexts/V4ProjectMetadataProvider'
import { V4UserNftCreditsProvider } from 'packages/v4/contexts/V4UserNftCreditsProvider'
import { V4UserTotalTokensBalanceProvider } from 'packages/v4/contexts/V4UserTotalTokensBalanceProvider'
import { wagmiConfig } from 'packages/v4/wagmiConfig'
import React, { PropsWithChildren } from 'react'
import { Provider } from 'react-redux'
import { WagmiProvider } from 'wagmi'

const V4ProjectProviders: React.FC<
  PropsWithChildren & { chainId: JBChainId; projectId: bigint }
> = ({ chainId, projectId, children }) => {
  return (
    <AppWrapper txHistoryProvider="wagmi">
      <WagmiProvider config={wagmiConfig}>
        <JBProjectProvider
          chainId={chainId}
          projectId={projectId}
          ctxProps={{
            metadata: { ipfsGatewayHostname: OPEN_IPFS_GATEWAY_HOSTNAME },
          }}
        >
          <V4ProjectMetadataProvider projectId={projectId}>
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
          </V4ProjectMetadataProvider>
        </JBProjectProvider>
      </WagmiProvider>
    </AppWrapper>
  )
}
export default V4ProjectProviders
