import './styles/antd.css'
import './styles/index.scss'

import App from 'components/App'
import Network from 'Network'
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import User from 'User'

import store from './redux/store'
import reportWebVitals from './reportWebVitals'

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Network>
        <User>
          <App />
        </User>
      </Network>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root'),
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
