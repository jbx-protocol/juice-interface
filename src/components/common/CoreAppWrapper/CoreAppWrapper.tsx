import React, { useEffect } from 'react'

import { Content } from 'antd/lib/layout/layout'
import { EtherPriceProvider } from 'contexts/EtherPrice/EtherPriceProvider'
import { Layout } from 'antd'
import { QuickProjectSearchProvider } from 'components/QuickProjectSearch/QuickProjectSearchProvider'
import { SiteNavigation } from 'components/Navbar/SiteNavigation'
import { ProtocolActivityProvider } from 'components/ProtocolActivity/ProtocolActivityContext'
import { ProtocolActivityPanel } from 'components/ProtocolActivity/ProtocolActivityPanel'

import dynamic from 'next/dynamic'
import { installJuiceboxWindowObject } from 'lib/juicebox'
import { redirectTo } from 'utils/windowUtils'
import { twJoin, twMerge } from 'tailwind-merge'
import useMobile from 'hooks/useMobile'
import { useRouter } from 'next/router'

const EthersTxHistoryProvider = dynamic(
  () => import('contexts/Transaction/EthersTxHistoryProvider'),
  { ssr: false },
)
const WagmiTxHistoryProvider = dynamic(
  () => import('contexts/Transaction/WagmiTxHistoryProvider'),
  { ssr: false },
)

const useAdjustUrl = () => {
  const router = useRouter()

  useEffect(() => {
    const { asPath, isReady } = router

    // Decode %3A back to : for v4 project routes
    const newPath = asPath.replace(/\/v4\/([^%]+)%3A(\d+)/g, '/v4/$1:$2')
    if (newPath !== asPath) {
      history.replaceState(history.state, '', newPath)
      return
    }
  }, [router])
}

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
      <TxHistoryProvider>
        <EtherPriceProvider>
          <QuickProjectSearchProvider>
            <ProtocolActivityProvider>
              <_Wrapper hideNav={hideNav}>{children}</_Wrapper>
            </ProtocolActivityProvider>
          </QuickProjectSearchProvider>
        </EtherPriceProvider>
      </TxHistoryProvider>
    </React.StrictMode>
  )
}

const _Wrapper: React.FC<React.PropsWithChildren<{ hideNav?: boolean }>> = ({
  children,
  hideNav,
}) => {
  const router = useRouter()
  const isMobile = useMobile()
  useAdjustUrl()

  // run on initial mount
  useEffect(() => {
    installJuiceboxWindowObject()
  }, [])

  // Check if we're on a project page (v4/v5 projects render their own activity panel)
  const isProjectPage = router.pathname.startsWith('/v5/') || router.pathname.startsWith('/v4/')
  const isProjectRoute = /^\/(v4|v5)\/[^\/]+/.test(router.asPath)
  const showProtocolActivity = !isMobile && !(isProjectPage && isProjectRoute)

  return (
    <Layout className="flex min-h-screen flex-col bg-transparent">
      {hideNav ? null : <SiteNavigation />}
      <Content
        className={twMerge(
          twJoin(!hideNav ? 'pt-20' : '', 'md:p-0'),
        )}
      >
        <div className="flex">
          <div className="flex-1 min-w-0">
            {children}
          </div>
          {showProtocolActivity && <ProtocolActivityPanel />}
        </div>
      </Content>
    </Layout>
  )
}
