/**
 * @jest-environment jsdom
 */
import { render } from '@testing-library/react'
import { CyclesPayoutsPanel } from './CyclesPayoutsPanel'

jest.mock('./components/CurrentUpcomingSubPanel', () => ({
  CurrentUpcomingSubPanel: jest
    .fn()
    .mockReturnValue(<div>CurrentUpcomingSubPanel</div>),
}))

describe('CyclesPayoutsPanel', () => {
  it('renders', () => {
    const { container } = render(<CyclesPayoutsPanel />)
    expect(container).toMatchSnapshot()
  })
})
