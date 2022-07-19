import LanguageProvider from 'providers/LanguageProvider'
import { NetworkProvider } from 'providers/NetworkProvider'
import ReactQueryProvider from 'providers/ReactQueryProvider'
import { ThemeProvider } from 'providers/ThemeProvider'
import { V1UserProvider } from 'providers/v1/UserProvider'
import React from 'react'
import { Provider } from 'react-redux'
import store from 'redux/store'

/**
 * Contains all the core app providers used by each page.
 */
export const CoreAppWrapper: React.FC = ({ children }) => {
  return (
    <React.StrictMode>
      <ReactQueryProvider>
        <Provider store={store}>
          <LanguageProvider>
            <ThemeProvider>
              <NetworkProvider>
                {/* TODO: Remove v1 provider */}
                <V1UserProvider>{children}</V1UserProvider>
              </NetworkProvider>
            </ThemeProvider>
          </LanguageProvider>
        </Provider>
      </ReactQueryProvider>
    </React.StrictMode>
  )
}
