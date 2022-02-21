import { render } from '../../test/test-utils'

import App from '../App'

test('renders learn react link', async () => {
  const screen = render(<App />)
  expect(screen).toThrow(TypeError)
})
