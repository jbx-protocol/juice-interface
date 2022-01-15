import './styles/antd.css'
import './styles/index.scss'

import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import App from 'App'
import NetworkProvider from 'providers/NetworkProvider'
import ThemeProvider from 'providers/ThemeProvider'
import UserProvider from 'providers/UserProvider'
import LanguageProvider from 'providers/LanguageProvider'
import ReactQueryProvier from 'providers/ReactQueryProvider'

import store from './redux/store'
import reportWebVitals from './utils/reportWebVitals'

ReactDOM.render(
  <React.StrictMode>
    <ReactQueryProvier>
      <Provider store={store}>
        <LanguageProvider>
          <ThemeProvider>
            <NetworkProvider>
              <UserProvider>
                <App />
              </UserProvider>
            </NetworkProvider>
          </ThemeProvider>
        </LanguageProvider>
      </Provider>
    </ReactQueryProvier>
  </React.StrictMode>,
  document.getElementById('root'),
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
