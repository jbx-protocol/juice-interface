/**
 * @jest-environment jsdom
 */
import { render } from '@testing-library/react'
import { HistorySubPanel } from './HistorySubPanel'

describe('HistorySubPanel', () => {
  it('renders', () => {
    const { container } = render(<HistorySubPanel />)
    expect(container).toMatchSnapshot()
  })
})
