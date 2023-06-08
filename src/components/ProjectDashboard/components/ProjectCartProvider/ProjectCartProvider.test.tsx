/**
 * @jest-environment jsdom
 */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { fireEvent, render, screen } from '@testing-library/react'
import { NftRewardsContext } from 'contexts/NftRewards/NftRewardsContext'
import { useContext } from 'react'
import { V2V3_CURRENCY_ETH } from 'utils/v2v3/currency'
import { ProjectCartContext, ProjectCartProvider } from './ProjectCartProvider'

jest.mock('contexts/NftRewards/NftRewardsContext')

describe('ProjectCartProvider', () => {
  const DefaultNftRewardsContext = {
    nftRewards: {
      rewardTiers: [
        {
          id: 1,
          name: 'name',
          contributionFloor: 1,
          maxSupply: undefined,
          remainingSupply: undefined,
          fileUrl: 'fileUrl',
          reservedRate: undefined,
          beneficiary: undefined,
          votingWeight: undefined,
          externalLink: undefined,
          description: undefined,
        },
      ],
    },
    loading: false,
  } as any

  const MockNftRewardsProvider = ({
    children,
  }: {
    children: React.ReactNode
  }) => {
    return (
      <NftRewardsContext.Provider value={DefaultNftRewardsContext}>
        {children}
      </NftRewardsContext.Provider>
    )
  }

  it('provides the initial state correctly', () => {
    const TestComponent = () => {
      const {
        payAmount,
        totalAmount,
        visible,
        expanded,
        userIsReceivingTokens,
      } = useContext(ProjectCartContext)
      return (
        <div>
          <div data-testid="payAmount">{JSON.stringify(payAmount)}</div>
          <div data-testid="totalAmount">{JSON.stringify(totalAmount)}</div>
          <div data-testid="visible">{String(visible)}</div>
          <div data-testid="expanded">{String(expanded)}</div>
          <div data-testid="userIsReceivingTokens">
            {String(userIsReceivingTokens)}
          </div>
        </div>
      )
    }

    render(
      <MockNftRewardsProvider>
        <ProjectCartProvider>
          <TestComponent />
        </ProjectCartProvider>
      </MockNftRewardsProvider>,
    )

    expect(screen.getByTestId('payAmount')).toHaveTextContent('')
    expect(screen.getByTestId('visible')).toHaveTextContent('false')
    expect(screen.getByTestId('expanded')).toHaveTextContent('false')
    expect(screen.getByTestId('userIsReceivingTokens')).toHaveTextContent(
      'true',
    )
  })

  it('shows total amount of nft quantity and pay amount when pay and nft added', () => {
    const TestComponent = () => {
      const { totalAmount, dispatch } = useContext(ProjectCartContext)
      const handleClick = () => {
        dispatch({
          type: 'addPayment',
          payload: { amount: 100, currency: V2V3_CURRENCY_ETH },
        })
        dispatch({
          type: 'upsertNftReward',
          payload: {
            nftReward: { id: 1, quantity: 1 },
          },
        })
        dispatch({
          type: 'increaseNftRewardQuantity',
          payload: { id: 1 },
        })
      }
      return (
        <div>
          <button onClick={handleClick}>Run test</button>
          <div data-testid="totalAmount">{JSON.stringify(totalAmount)}</div>
        </div>
      )
    }

    render(
      <MockNftRewardsProvider>
        <ProjectCartProvider>
          <TestComponent />
        </ProjectCartProvider>
      </MockNftRewardsProvider>,
    )

    fireEvent.click(screen.getByText('Run test'))

    const expectedAmount =
      100 +
      DefaultNftRewardsContext.nftRewards.rewardTiers[0].contributionFloor * 2

    expect(screen.getByTestId('totalAmount')).toHaveTextContent(
      JSON.stringify({ amount: expectedAmount, currency: V2V3_CURRENCY_ETH }),
    )
  })

  test('visible is true when pay amount is greater than 0 or nft reward is added', () => {
    const TestComponent = () => {
      const { visible, dispatch } = useContext(ProjectCartContext)
      const addPayClick = () => {
        dispatch({
          type: 'addPayment',
          payload: { amount: 100, currency: V2V3_CURRENCY_ETH },
        })
      }
      const removePayClick = () => {
        dispatch({
          type: 'removePayment',
        })
      }
      const addNftClick = () => {
        dispatch({
          type: 'upsertNftReward',
          payload: {
            nftReward: { id: 1, quantity: 1 },
          },
        })
      }
      const removeNftClick = () => {
        dispatch({
          type: 'removeNftReward',
          payload: { id: 1 },
        })
      }
      return (
        <div>
          <button onClick={addPayClick}>Add pay</button>
          <button onClick={removePayClick}>Remove pay</button>
          <button onClick={addNftClick}>Add nft</button>
          <button onClick={removeNftClick}>Remove nft</button>
          <div data-testid="visible">{JSON.stringify(visible)}</div>
        </div>
      )
    }

    render(
      <MockNftRewardsProvider>
        <ProjectCartProvider>
          <TestComponent />
        </ProjectCartProvider>
      </MockNftRewardsProvider>,
    )

    expect(screen.getByTestId('visible')).toHaveTextContent('false')
    fireEvent.click(screen.getByText('Add pay'))
    expect(screen.getByTestId('visible')).toHaveTextContent('true')
    fireEvent.click(screen.getByText('Add nft'))
    expect(screen.getByTestId('visible')).toHaveTextContent('true')
    fireEvent.click(screen.getByText('Remove pay'))
    expect(screen.getByTestId('visible')).toHaveTextContent('true')
    fireEvent.click(screen.getByText('Remove nft'))
    expect(screen.getByTestId('visible')).toHaveTextContent('false')
  })

  it('provides a dispatch function that updates the state', () => {
    const TestComponent = () => {
      const { dispatch, totalAmount: payAmount } =
        useContext(ProjectCartContext)
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
