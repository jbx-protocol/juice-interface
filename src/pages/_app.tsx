import '../styles/antd.css'
import '../styles/index.scss'

import { Provider } from 'react-redux'
import type { AppProps } from 'next/app'

import App from 'App'
import LanguageProvider from 'providers/LanguageProvider'
import ReactQueryProvider from 'providers/ReactQueryProvider'

import { NetworkProvider } from 'providers/NetworkProvider'
import { ThemeProvider } from 'providers/ThemeProvider'
import { V1UserProvider } from 'providers/v1/UserProvider'

import store from '../redux/store'
import initSentry from '../lib/sentry'

initSentry()

export default function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <ReactQueryProvider>
      <Provider store={store}>
        <LanguageProvider>
          <ThemeProvider>
            <NetworkProvider>
              <V1UserProvider>
                <App>
                  <Component {...pageProps} />
                </App>
              </V1UserProvider>
            </NetworkProvider>
          </ThemeProvider>
        </LanguageProvider>
      </Provider>
    </ReactQueryProvider>
  )
}
