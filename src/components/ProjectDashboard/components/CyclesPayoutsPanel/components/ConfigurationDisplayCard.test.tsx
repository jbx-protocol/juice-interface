/**
 * @jest-environment jsdom
 */
import { render } from '@testing-library/react'
import { ConfigurationDisplayCard } from './ConfigurationDisplayCard'

jest.mock('../hooks/useConfigurationDisplayCard', () => ({
  useConfigurationDisplayCard: jest.fn().mockReturnValue({
    title: 'Current',
  }),
}))

jest.mock('./ConfigurationPanel', () => ({
  ConfigurationPanel: jest.fn(() => (
    <div data-testid="ConfigurationPanel">ConfigurationPanel</div>
  )),
}))

describe('ConfigurationDisplayCard', () => {
  it('renders', () => {
    const { container } = render(<ConfigurationDisplayCard type="current" />)
    expect(container).toMatchSnapshot()
  })

  test('title is Current', () => {
    const { container } = render(<ConfigurationDisplayCard type="current" />)
    expect(container).toHaveTextContent('Current')
  })
})
