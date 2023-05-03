import { Layout } from 'antd'
import { Content } from 'antd/lib/layout/layout'
import SiteNavigation from 'components/Navbar/SiteNavigation'
import { AnnouncementsProvider } from 'contexts/Announcements/AnnouncementsProvider'
import { ArcxProvider } from 'contexts/Arcx/ArcxProvider'
import { EtherPriceProvider } from 'contexts/EtherPrice/EtherPriceProvider'
import LanguageProvider from 'contexts/Language/LanguageProvider'
import ReactQueryProvider from 'contexts/ReactQueryProvider'
import { ThemeProvider } from 'contexts/Theme/ThemeProvider'
import TxHistoryProvider from 'contexts/Transaction/TxHistoryProvider'
import { installJuiceboxWindowObject } from 'lib/juicebox'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { redirectTo } from 'utils/windowUtils'

/**
 * Contains all the core app providers used by each page.
 *
 * This is currently embedded on each page individually. This decision was made
 * as the current language provider doesn't support pre-rendering. Pre-rendering
 * is still an issue, but the current structure allows opengraph and twitter
 * meta tags to be setup correctly.
 */
export const AppWrapper: React.FC = ({ children }) => {
  return (
    <React.StrictMode>
      <ReactQueryProvider>
        <LanguageProvider>
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
        </LanguageProvider>
      </ReactQueryProvider>
    </React.StrictMode>
  )
}

const _Wrapper: React.FC = ({ children }) => {
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
