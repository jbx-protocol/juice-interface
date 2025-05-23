import { Layout } from 'antd'
import { Content } from 'antd/lib/layout/layout'
import { SiteNavigation } from 'components/Navbar/SiteNavigation'
import { QuickProjectSearchProvider } from 'components/QuickProjectSearch/QuickProjectSearchProvider'
import { EtherPriceProvider } from 'contexts/EtherPrice/EtherPriceProvider'
import ReactQueryProvider from 'contexts/ReactQueryProvider'
import { ThemeProvider } from 'contexts/Theme/ThemeProvider'
import { useInitWallet } from 'hooks/Wallet'
import { installJuiceboxWindowObject } from 'lib/juicebox'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { wagmiConfig } from 'packages/v4/wagmiConfig'
import React, { useEffect } from 'react'
import { twJoin } from 'tailwind-merge'
import { redirectTo } from 'utils/windowUtils'
import { WagmiProvider } from 'wagmi'
const EthersTxHistoryProvider = dynamic(
  () => import('contexts/Transaction/EthersTxHistoryProvider'),
  { ssr: false },
)
const WagmiTxHistoryProvider = dynamic(
  () => import('contexts/Transaction/WagmiTxHistoryProvider'),
  { ssr: false },
)

/**
 * Contains all the core app providers used by each page.
 *
 * This is currently embedded on each page individually. This decision was made
 * as the current language provider doesn't support pre-rendering. Pre-rendering
 * is still an issue, but the current structure allows opengraph and twitter
 * meta tags to be setup correctly.
 */
export const AppWrapper: React.FC<
  React.PropsWithChildren<{
    hideNav?: boolean
    txHistoryProvider?: 'ethers' | 'wagmi'
  }>
> = ({ children, hideNav, txHistoryProvider }) => {
  const TxHistoryProvider =
    txHistoryProvider === 'wagmi'
      ? WagmiTxHistoryProvider
      : EthersTxHistoryProvider

  return (
    <React.StrictMode>
      <WagmiProvider config={wagmiConfig}>
        <ReactQueryProvider>
          <TxHistoryProvider>
            <ThemeProvider>
              <EtherPriceProvider>
                <QuickProjectSearchProvider>
                  <_Wrapper hideNav={hideNav}>{children}</_Wrapper>
                </QuickProjectSearchProvider>
              </EtherPriceProvider>
            </ThemeProvider>
          </TxHistoryProvider>
        </ReactQueryProvider>
      </WagmiProvider>
    </React.StrictMode>
  )
}

const _Wrapper: React.FC<React.PropsWithChildren<{ hideNav?: boolean }>> = ({
  children,
  hideNav,
}) => {
  const router = useRouter()
  useInitWallet()

  // run on initial mount
  useEffect(() => {
    installJuiceboxWindowObject()
  }, [])

  // redirect legacy hash routes
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
