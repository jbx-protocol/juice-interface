/**
 * @jest-environment jsdom
 */
import { render } from '@testing-library/react'
import { TokensPanel } from './TokensPanel'

describe('TokensPanel', () => {
  it('renders', () => {
    render(<TokensPanel />)
  })
})
