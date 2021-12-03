import type { AppProps } from 'next/app'
import { Provider } from 'react-redux'

import 'styles/antd.css'
import 'styles/index.scss'

import Network from 'Network'
import React from 'react'
import Theme from 'Theme'
import User from 'User'

import store from 'redux/store'

export default function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <Provider store={store}>
      <Theme>
        <Network>
          <User>
            <Component {...pageProps} />
          </User>
        </Network>
      </Theme>
    </Provider>
  )
}
