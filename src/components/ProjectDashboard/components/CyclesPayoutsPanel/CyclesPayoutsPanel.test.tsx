/**
 * @jest-environment jsdom
 */
import { render } from '@testing-library/react'
import { CyclesPayoutsPanel } from './CyclesPayoutsPanel'

describe('CyclesPayoutsPanel', () => {
  it('renders', () => {
    const { container } = render(<CyclesPayoutsPanel />)
    expect(container).toMatchSnapshot()
  })
})
