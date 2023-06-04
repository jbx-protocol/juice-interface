/**
 * @jest-environment jsdom
 */

import { fireEvent, render, screen } from '@testing-library/react'
import { useContext } from 'react'
import { V2V3_CURRENCY_ETH } from 'utils/v2v3/currency'
import { ProjectCartContext, ProjectCartProvider } from './ProjectCartProvider'

describe('ProjectCartProvider', () => {
  it('provides the initial state correctly', () => {
    const TestComponent = () => {
      const { payAmount, visible, expanded, userIsReceivingTokens } =
        useContext(ProjectCartContext)
      return (
        <div>
          <div data-testid="payAmount">{JSON.stringify(payAmount)}</div>
          <div data-testid="visible">{String(visible)}</div>
          <div data-testid="expanded">{String(expanded)}</div>
          <div data-testid="userIsReceivingTokens">
            {String(userIsReceivingTokens)}
          </div>
        </div>
      )
    }

    render(
      <ProjectCartProvider>
        <TestComponent />
      </ProjectCartProvider>,
    )

    expect(screen.getByTestId('payAmount')).toHaveTextContent('')
    expect(screen.getByTestId('visible')).toHaveTextContent('false')
    expect(screen.getByTestId('expanded')).toHaveTextContent('false')
    expect(screen.getByTestId('userIsReceivingTokens')).toHaveTextContent(
      'true',
    )
  })

  it('provides a dispatch function that updates the state', () => {
    const TestComponent = () => {
      const { dispatch, payAmount } = useContext(ProjectCartContext)
      const handleClick = () => {
        dispatch({
          type: 'addPayment',
          payload: { amount: 100, currency: V2V3_CURRENCY_ETH },
        })
      }

      return (
        <div>
          <button onClick={handleClick}>Change Pay Amount</button>
          <div data-testid="payAmount">{JSON.stringify(payAmount)}</div>
        </div>
      )
    }

    render(
      <ProjectCartProvider>
        <TestComponent />
      </ProjectCartProvider>,
    )

    fireEvent.click(screen.getByText('Change Pay Amount'))
    expect(screen.getByTestId('payAmount')).toHaveTextContent(
      JSON.stringify({ amount: 100, currency: V2V3_CURRENCY_ETH }),
    )
  })
})
