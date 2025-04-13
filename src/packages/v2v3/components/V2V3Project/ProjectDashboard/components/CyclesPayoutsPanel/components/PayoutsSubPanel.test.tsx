/**
 * @jest-environment jsdom
 */
import { render } from '@testing-library/react'
import { PayoutsSubPanel } from './PayoutsSubPanel'

jest.mock('components/modals/TransactionModal', () =>
  jest.fn().mockImplementation(() => <div>TransactionModal</div>),
)

describe('PayoutsSubPanel', () => {
  it('renders', () => {
    render(<PayoutsSubPanel type="current" />)
  })
})
