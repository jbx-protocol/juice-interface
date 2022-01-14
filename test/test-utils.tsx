import { act, render } from '@testing-library/react'
import { createMemoryHistory } from 'history'
import { MemoryHistory } from 'history/createMemoryHistory'
import { QueryClient } from 'react-query'
import { Provider } from 'react-redux'

import { i18n } from '@lingui/core'

import { I18nProvider } from '@lingui/react'

import store from '../src/redux/store'
import { LanguageProvider } from '../src/i18n'
import Theme from '../src/Theme'
import Network from '../src/Network'
import User from '../src/User'
import ProvideReactQuery from '../src/ReactQuery'
import { Language } from '../src/constants/languages/language-options'

export const MOCK_TEST_UUID = '1234-56768-123-4567'

type DefaultParams = Parameters<typeof render>

type RenderOptions = DefaultParams[1] & {
  locale?: keyof Language
  cookies?: Record<string, string>
  router?: MemoryHistory
  queryClient?: QueryClient
  user?: {
    username: string
  }
}

interface SimplifiedRouterOptions {
  initialEntries?: string[]
  historyRoutes?: string[]
  url?: string
}

export const setupRouter = (options?: SimplifiedRouterOptions) => {
  const initialEntries: string[] = options?.initialEntries || []

  if (!options?.initialEntries) {
    if (options?.historyRoutes) {
      initialEntries.push(...options.historyRoutes)
    }

    if (options?.url) {
      initialEntries.push(options.url)
    }
  }

  return createMemoryHistory({
    initialEntries,
  })
}

const customRender = (
  ui: any,
  {
    cookies: mockCookies,
    locale = 'en',
    queryClient,
    router = setupRouter(),
    user,
    wrapper,
    ...options
  }: RenderOptions = {},
) => {
  // Lingui testing: https://lingui.js.org/guides/testing.html
  act(() => {
    i18n.activate(locale)
  })

  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  })

  if (!wrapper) {
    wrapper = ({ children }) => (
      <ProvideReactQuery>
        <Provider store={store}>
          <I18nProvider i18n={i18n}>
            <Theme>
              <Network>
                <User>{children}</User>
              </Network>
            </Theme>
          </I18nProvider>
        </Provider>
      </ProvideReactQuery>
    )
  }

  return render(ui, { wrapper, ...options })
}

export * from '@testing-library/react'
export { customRender as render }
