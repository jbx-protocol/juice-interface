import React, { useEffect } from 'react'

import { Content } from 'antd/lib/layout/layout'
import { EtherPriceProvider } from 'contexts/EtherPrice/EtherPriceProvider'
import { Layout } from 'antd'
import { QuickProjectSearchProvider } from 'components/QuickProjectSearch/QuickProjectSearchProvider'
import { SiteNavigation } from 'components/Navbar/SiteNavigation'

import dynamic from 'next/dynamic'
import { installJuiceboxWindowObject } from 'lib/juicebox'
import { redirectTo } from 'utils/windowUtils'
import { twJoin } from 'tailwind-merge'
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
            <_Wrapper hideNav={hideNav}>{children}</_Wrapper>
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
  useAdjustUrl()

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
