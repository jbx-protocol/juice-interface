/**
 * @jest-environment jsdom
 */
import { renderHook } from '@testing-library/react'
import { Price, Token } from '@uniswap/sdk-core'
import { ADDRESS_ZERO } from '@uniswap/v3-sdk'
import { useUniswapPriceQuery } from 'components/AMMPrices/hooks/useERC20UniswapPrice'
import { useWallet } from 'hooks/Wallet'
import { useCurrencyConverter } from 'hooks/useCurrencyConverter'
import { CurrencyUtils } from 'utils/format/formatCurrency'
import { V2V3_CURRENCY_ETH, V2V3_CURRENCY_USD } from 'utils/v2v3/currency'
import { useProjectCart } from '../useProjectCart'
import { useProjectPageQueries } from '../useProjectPageQueries'
import { usePayProjectModal } from './usePayProjectModal'

jest.mock('hooks/Wallet')
jest.mock('hooks/useCurrencyConverter')
jest.mock('../useProjectCart')
jest.mock('../useProjectPageQueries')
jest.mock('components/AMMPrices/hooks/useERC20UniswapPrice')

describe('usePayProjectModal', () => {
  const DefaultuseProjectCart = {
    dispatch: jest.fn(),
    payModalOpen: false,
    nftRewards: [],
    totalAmount: {
      amount: 0,
      currency: V2V3_CURRENCY_ETH,
    },
  }
  const DefaultUseProjectPageQueries = {
    setProjectPayReceipt: jest.fn(),
  }
  const DefaultUseWallet = {
    userAddress: '0x1234567890',
  }
  const mockCurrencyUtils = new CurrencyUtils(2000)
  const mockPriceQuery = {
    data: {
      liquidity: '1000000',
      projectTokenPrice: new Price(
        new Token(1, ADDRESS_ZERO, 18),
        new Token(1, ADDRESS_ZERO, 18),
        1000,
        1000,
      ),
    },
  }
  beforeEach(() => {
    DefaultuseProjectCart.dispatch.mockClear()
    DefaultUseProjectPageQueries.setProjectPayReceipt.mockClear()
    ;(useProjectCart as jest.Mock).mockReturnValue(DefaultuseProjectCart)
    ;(useWallet as jest.Mock).mockReturnValue(DefaultUseWallet)
    ;(useCurrencyConverter as jest.Mock).mockReturnValue(mockCurrencyUtils)
    ;(useUniswapPriceQuery as jest.Mock).mockReturnValue(mockPriceQuery)
    ;(useProjectPageQueries as jest.Mock).mockReturnValue(
      DefaultUseProjectPageQueries,
    )
  })

  it.each`
    payModalOpen | open
    ${true}      | ${true}
    ${false}     | ${false}
  `(
    'returns open=$open when payModalOpen=$payModalOpen',
    ({ payModalOpen, open }) => {
      ;(useProjectCart as jest.Mock).mockReturnValue({
        ...DefaultuseProjectCart,
        payModalOpen,
      })
      const { result } = renderHook(usePayProjectModal)
      expect(result.current.open).toBe(open)
    },
  )

  test('setOpen calls dispatch', () => {
    const { result } = renderHook(usePayProjectModal)
    result.current.setOpen(true)
    expect(DefaultuseProjectCart.dispatch).toHaveBeenCalledWith({
      type: 'setPayModal',
      payload: { open: true },
    })
  })
  //
  test.each`
    totalAmount                                      | expectedPrimaryAmount | expectedSecondaryAmount
    ${{ amount: 0, currency: V2V3_CURRENCY_ETH }}    | ${'Ξ0'}               | ${'US$0'}
    ${{ amount: 1, currency: V2V3_CURRENCY_ETH }}    | ${'Ξ1'}               | ${'US$2,000'}
    ${{ amount: 2000, currency: V2V3_CURRENCY_USD }} | ${'US$2,000'}         | ${`Ξ1`}
  `(
    `returns primaryAmount=$expectedPrimaryAmount and secondaryAmount=$expectedSecondaryAmount when totalAmount=$totalAmount`,
    ({ totalAmount, expectedPrimaryAmount, expectedSecondaryAmount }) => {
      ;(useProjectCart as jest.Mock).mockReturnValue({
        ...DefaultuseProjectCart,
        totalAmount,
      })
      const { result } = renderHook(usePayProjectModal)
      expect(result.current.primaryAmount).toBe(expectedPrimaryAmount)
      expect(result.current.secondaryAmount).toBe(expectedSecondaryAmount)
    },
  )
})
