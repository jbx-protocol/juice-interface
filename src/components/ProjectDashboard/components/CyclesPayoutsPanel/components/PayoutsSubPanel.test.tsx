/**
 * @jest-environment jsdom
 */
import { render } from '@testing-library/react'
import { PayoutsSubPanel } from './PayoutsSubPanel'

describe('PayoutsSubPanel', () => {
  it('renders', () => {
    render(<PayoutsSubPanel type="current" />)
  })
})
