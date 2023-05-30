/**
 * @jest-environment jsdom
 */
import { render } from '@testing-library/react'
import { useConfigurationPanel } from '../hooks/useConfigurationPanel'
import { ConfigurationPanel } from './ConfigurationPanel'

jest.mock('../hooks/useConfigurationPanel', () => ({
  useConfigurationPanel: jest.fn(),
}))

jest.mock('./ConfigurationTable', () => ({
  ConfigurationTable: jest.fn(() => (
    <div data-testid="ConfigurationTable">ConfigurationTable</div>
  )),
}))

const DefaultResponse = {
  cycle: {
    foo: 'foo',
  },
  token: {
    bar: 'bar',
  },
  otherRules: {
    baz: 'baz',
  },
}

const mockUseConfigurationPanel = useConfigurationPanel as jest.Mock

describe('ConfigurationPanel', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockUseConfigurationPanel.mockImplementation(() => DefaultResponse)
  })

  it('renders', () => {
    const { container } = render(<ConfigurationPanel type={'current'} />)
    expect(container).toMatchSnapshot()
  })

  it.each(['current', 'upcoming'] as const)(
    'calls useConfigurationPanel with type %p',
    type => {
      render(<ConfigurationPanel type={type} />)
      expect(mockUseConfigurationPanel).toHaveBeenCalledWith(type)
    },
  )
})
