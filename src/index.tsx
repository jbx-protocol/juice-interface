import './styles/antd.css'
import './styles/index.scss'

import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import App from 'App'
import LanguageProvider from 'providers/LanguageProvider'
import ReactQueryProvider from 'providers/ReactQueryProvider'

import { NetworkProvider } from 'providers/NetworkProvider'
import { ThemeProvider } from 'providers/ThemeProvider'
import { V1UserProvider } from 'providers/v1/UserProvider'

import store from './redux/store'
import initSentry from './lib/sentry'

initSentry()

ReactDOM.render(
  <React.StrictMode>
    <ReactQueryProvider>
      <Provider store={store}>
        <LanguageProvider>
          <ThemeProvider>
            <NetworkProvider>
              <V1UserProvider>
                <App />
              </V1UserProvider>
            </NetworkProvider>
          </ThemeProvider>
        </LanguageProvider>
      </Provider>
    </ReactQueryProvider>
  </React.StrictMode>,
  document.getElementById('root'),
)
