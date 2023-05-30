/**
 * @jest-environment jsdom
 */
import { render } from '@testing-library/react'
import { ReservedTokensSubPanel } from './ReservedTokensSubPanel'

describe('ReservedTokensSubPanel', () => {
  it('renders', () => {
    render(<ReservedTokensSubPanel />)
  })
})
