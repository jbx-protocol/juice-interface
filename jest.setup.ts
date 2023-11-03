require('dotenv').config()
require('@testing-library/jest-dom')
require('jest-fetch-mock')
const { i18n } = require('@lingui/core')
const { messages } = require('./src/locales/en/messages.js')
i18n.load('en', messages)
i18n.activate('en')

jest.clearAllMocks()

jest.mock('hooks/Wallet/useInitWallet', () => ({
  initWeb3Onboard: jest.fn(),
  useInitWallet: jest.fn(),
}))
jest.mock('hooks/Wallet/useWallet', () => ({
  useWallet: jest.fn(),
}))
