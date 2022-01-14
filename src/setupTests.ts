// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'
import { i18n } from '@lingui/core'

import { en } from 'make-plural/plurals'

import { messages } from './locales/en/messages'

beforeAll(() => {
  i18n.load({
    en: messages,
  })
  i18n.loadLocaleData({
    en: { plurals: en },
  })
})

beforeEach(() => {
  // Delete all cookies on every test run
  const cookies = document.cookie.split(';')

  for (let i = 0; i < cookies.length; i++) {
    const cookieSplit = cookies[i]
    const name = cookieSplit.split('=')[0]
    document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT'
  }

  localStorage.clear()
  sessionStorage.clear()
})

afterEach(() => {})

afterAll(() => {})
