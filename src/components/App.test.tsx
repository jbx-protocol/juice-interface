import { render, screen, act } from '@testing-library/react'
import { Provider } from 'react-redux'

import App from './App'
import ProvideReactQuery from '../ReactQuery'
import store from '../redux/store'

jest.mock('i18n')
jest.mock('@lingui/react', () => {
  return {
    Trans({ id }: { id: string }) {
      return id
    },
  }
})
jest.mock('@lingui/core', () => {
  return {
    plural: jest.fn(),
    i18n: {
      _: (str: string) => str,
    },
  }
})

test('renders without crashing', () => {
  global.matchMedia =
    global.matchMedia ||
    function () {
      return {
        addListener: jest.fn(),
        removeListener: jest.fn(),
      }
    }

  act(() => {
    render(
      <ProvideReactQuery>
        <Provider store={store}>
          <App />
        </Provider>
      </ProvideReactQuery>,
    )
  })

  expect(
    screen.getByText('Community funding for people and projects'),
  ).toBeInTheDocument()
})
