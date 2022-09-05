import { Layout } from 'antd'
import { Content } from 'antd/lib/layout/layout'
import Navbar from 'components/Navbar'
import useMobile from 'hooks/Mobile'
import { useRouter } from 'next/router'
import { EtherPriceProvider } from 'providers/EtherPriceProvider'
import LanguageProvider from 'providers/LanguageProvider'
import ReactQueryProvider from 'providers/ReactQueryProvider'
import { ThemeProvider } from 'providers/ThemeProvider'
import { V1UserProvider } from 'providers/v1/UserProvider'
import React from 'react'
import { Provider } from 'react-redux'
import store from 'redux/store'
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
        <Provider store={store}>
          <LanguageProvider>
            <ThemeProvider>
              {/* TODO: Remove v1 provider */}
              <V1UserProvider>
                <EtherPriceProvider>
                  <_Wrapper>{children}</_Wrapper>
                </EtherPriceProvider>
              </V1UserProvider>
            </ThemeProvider>
          </LanguageProvider>
        </Provider>
      </ReactQueryProvider>
    </React.StrictMode>
  )
}

const _Wrapper: React.FC = ({ children }) => {
  const router = useRouter()
  if (router.asPath.match(/^\/#\//)) {
    redirectTo(router.asPath.replace('/#/', ''))
  }
  const isMobile = useMobile()

  return (
    <>
      <Layout
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          background: 'transparent',
        }}
      >
        <Navbar />
        <Content style={isMobile ? { paddingTop: 40 } : {}}>{children}</Content>
      </Layout>
    </>
  )
}
