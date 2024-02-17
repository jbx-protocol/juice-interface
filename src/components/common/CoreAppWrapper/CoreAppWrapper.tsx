import { Layout } from 'antd'
import { Content } from 'antd/lib/layout/layout'
import { SiteNavigation } from 'components/Navbar/SiteNavigation'
import { QuickProjectSearchProvider } from 'components/QuickProjectSearch/QuickProjectSearchProvider'
import { EtherPriceProvider } from 'contexts/EtherPrice/EtherPriceProvider'
import ReactQueryProvider from 'contexts/ReactQueryProvider'
import { ThemeProvider } from 'contexts/Theme/ThemeProvider'
import TxHistoryProvider from 'contexts/Transaction/TxHistoryProvider'
import { installJuiceboxWindowObject } from 'lib/juicebox'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { twJoin } from 'tailwind-merge'
import { redirectTo } from 'utils/windowUtils'

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
