import { LedgerConnector } from '@wagmi/connectors/ledger'
import { InjectedConnector } from '@wagmi/core'
import { CoinbaseWalletConnector } from '@wagmi/core/connectors/coinbaseWallet'
import { MetaMaskConnector } from '@wagmi/core/connectors/metaMask'
import { Layout } from 'antd'
import { Content } from 'antd/lib/layout/layout'
import SiteNavigation from 'components/Navbar/SiteNavigation'
import { ConnectKitProvider } from 'connectkit'
import { AnnouncementsProvider } from 'contexts/Announcements/AnnouncementsProvider'
import { ArcxProvider } from 'contexts/Arcx/ArcxProvider'
import { EtherPriceProvider } from 'contexts/EtherPrice/EtherPriceProvider'
import ReactQueryProvider from 'contexts/ReactQueryProvider'
import { ThemeProvider } from 'contexts/Theme/ThemeProvider'
import TxHistoryProvider from 'contexts/Transaction/TxHistoryProvider'
import { installJuiceboxWindowObject } from 'lib/juicebox'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { redirectTo } from 'utils/windowUtils'
import { WagmiConfig, configureChains, createClient } from 'wagmi'
import { goerli, mainnet } from 'wagmi/chains'
import { SafeConnector } from 'wagmi/connectors/safe'
import { infuraProvider } from 'wagmi/providers/infura'

const LanguageProvider = dynamic(
  () => import('contexts/Language/LanguageProvider'),
  {
    ssr: false,
  },
)

const { chains, provider } = configureChains(
  [mainnet, goerli],
  [infuraProvider({ apiKey: process.env.NEXT_PUBLIC_INFURA_ID })],
)

const client = createClient({
  provider,
  connectors: [
    new InjectedConnector(),
    new MetaMaskConnector(),
    new SafeConnector({
      options: {
        debug: process.env.NODE_ENV === 'development',
      },
    }),
    new CoinbaseWalletConnector({
      options: { appName: 'Juicebox' },
    }),
    new LedgerConnector({
      chains,
    }),
  ],
})

/**
 * Contains all the core app providers used by each page.
 *
 * This is currently embedded on each page individually. This decision was made
 * as the current language provider doesn't support pre-rendering. Pre-rendering
 * is still an issue, but the current structure allows opengraph and twitter
 * meta tags to be setup correctly.
 */
export const AppWrapper: React.FC<React.PropsWithChildren<unknown>> = ({
  children,
}) => {
  return (
    <React.StrictMode>
      <ReactQueryProvider>
        <LanguageProvider>
          <WagmiConfig client={client}>
            <ConnectKitProvider>
              <TxHistoryProvider>
                <ThemeProvider>
                  <EtherPriceProvider>
                    <ArcxProvider>
                      <AnnouncementsProvider>
                        <_Wrapper>{children}</_Wrapper>
                      </AnnouncementsProvider>
                    </ArcxProvider>
                  </EtherPriceProvider>
                </ThemeProvider>
              </TxHistoryProvider>
            </ConnectKitProvider>
          </WagmiConfig>
        </LanguageProvider>
      </ReactQueryProvider>
    </React.StrictMode>
  )
}

const _Wrapper: React.FC<React.PropsWithChildren<unknown>> = ({ children }) => {
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
      <SiteNavigation />
      <Content className="pt-20 md:p-0">{children}</Content>
    </Layout>
  )
}
