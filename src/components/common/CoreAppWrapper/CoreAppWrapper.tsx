import { LedgerConnector } from '@wagmi/connectors/ledger'
import { InjectedConnector } from '@wagmi/core'
import { CoinbaseWalletConnector } from '@wagmi/core/connectors/coinbaseWallet'
import { MetaMaskConnector } from '@wagmi/core/connectors/metaMask'
import { Layout } from 'antd'
import { Content } from 'antd/lib/layout/layout'
import SiteNavigation from 'components/Navbar/SiteNavigation'
import { QuickProjectSearchProvider } from 'components/QuickProjectSearch'
import { ConnectKitProvider } from 'connectkit'
import { readNetwork } from 'constants/networks'
import { ArcxProvider } from 'contexts/Arcx/ArcxProvider'
import { EtherPriceProvider } from 'contexts/EtherPrice/EtherPriceProvider'
import ReactQueryProvider from 'contexts/ReactQueryProvider'
import { ThemeProvider } from 'contexts/Theme/ThemeProvider'
import TxHistoryProvider from 'contexts/Transaction/TxHistoryProvider'
import { installJuiceboxWindowObject } from 'lib/juicebox'
import { NetworkName } from 'models/networkName'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { twJoin } from 'tailwind-merge'
import { redirectTo } from 'utils/windowUtils'
import { WagmiConfig, configureChains, createClient } from 'wagmi'
import { goerli, mainnet } from 'wagmi/chains'
import { SafeConnector } from 'wagmi/connectors/safe'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { infuraProvider } from 'wagmi/providers/infura'

const chain = readNetwork.name === NetworkName.mainnet ? mainnet : goerli

const { chains, provider } = configureChains(
  [chain],
  [infuraProvider({ apiKey: process.env.NEXT_PUBLIC_INFURA_ID })],
)

const client = createClient({
  provider,
  connectors: [
    new InjectedConnector({ chains }),
    new MetaMaskConnector({ chains }),
    new SafeConnector({
      options: {
        debug: process.env.NODE_ENV === 'development',
      },
      chains,
    }),
    new CoinbaseWalletConnector({
      options: { appName: 'Juicebox' },
      chains,
    }),
    new LedgerConnector({
      chains,
    }),
    new WalletConnectConnector({
      options: {
        projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID ?? '',
        showQrModal: false,
      },
      chains,
    }),
  ],
  autoConnect: true,
})

/**
 * Contains all the core app providers used by each page.
 *
 * This is currently embedded on each page individually. This decision was made
 * as the current language provider doesn't support pre-rendering. Pre-rendering
 * is still an issue, but the current structure allows opengraph and twitter
 * meta tags to be setup correctly.
 */
export const AppWrapper: React.FC<
  React.PropsWithChildren<{ hideNav?: boolean }>
> = ({ children, hideNav }) => {
  return (
    <React.StrictMode>
      <ReactQueryProvider>
        <WagmiConfig client={client}>
          <ConnectKitProvider>
            <TxHistoryProvider>
              <ThemeProvider>
                <EtherPriceProvider>
                  <ArcxProvider>
                    <QuickProjectSearchProvider>
                      <_Wrapper hideNav={hideNav}>{children}</_Wrapper>
                    </QuickProjectSearchProvider>
                  </ArcxProvider>
                </EtherPriceProvider>
              </ThemeProvider>
            </TxHistoryProvider>
          </ConnectKitProvider>
        </WagmiConfig>
      </ReactQueryProvider>
    </React.StrictMode>
  )
}

const _Wrapper: React.FC<React.PropsWithChildren<{ hideNav?: boolean }>> = ({
  children,
  hideNav,
}) => {
  const router = useRouter()

  // run on initial mount
  useEffect(() => {
    installJuiceboxWindowObject()
  }, [])

  if (router.asPath.match(/^\/#\//)) {
    redirectTo(router.asPath.replace('/#/', ''))
  }

  return (
    <Layout className="flex h-screen flex-col bg-transparent">
      {hideNav ? null : <SiteNavigation />}
      <Content className={twJoin(!hideNav ? 'pt-20' : '', 'md:p-0')}>
        {children}
      </Content>
    </Layout>
  )
}
