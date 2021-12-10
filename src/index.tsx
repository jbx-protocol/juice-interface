import './styles/antd.css'
import './styles/index.scss'

import App from 'components/App'
import Network from 'Network'
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import Theme from 'Theme'
import User from 'User'

import store from './redux/store'
import reportWebVitals from './reportWebVitals'
import ProvideReactQuery from './ReactQuery'
import { LanguageProvider } from './i18n'

ReactDOM.render(
  <React.StrictMode>
    <ProvideReactQuery>
      <Provider store={store}>
        <LanguageProvider>
          <Theme>
            <Network>
              <User>
                <App />
              </User>
            </Network>
          </Theme>
        </LanguageProvider>
      </Provider>
    </ProvideReactQuery>
  </React.StrictMode>,
  document.getElementById('root'),
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
