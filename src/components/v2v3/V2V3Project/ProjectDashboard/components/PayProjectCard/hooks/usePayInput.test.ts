/* eslint-disable @typescript-eslint/no-explicit-any */
import { act, renderHook } from '@testing-library/react-hooks'
import { V2V3_CURRENCY_ETH, V2V3_CURRENCY_USD } from 'utils/v2v3/currency'
import { usePayInput } from './usePayInput'

describe('usePayInput', () => {
  it('should show amount value updates onInputChange', () => {
    const { result } = renderHook(usePayInput)
    expect(result.current.value).toEqual({
      amount: '',
      currency: V2V3_CURRENCY_ETH,
    })
    act(() => {
      result.current.onInputChange({ target: { value: '1' } } as any)
    })
    expect(result.current.value).toEqual({
      amount: '1',
      currency: V2V3_CURRENCY_ETH,
    })
  })

  it('should show currency value updates onCurrencyChange', () => {
    const { result } = renderHook(usePayInput)
    expect(result.current.value).toEqual({
      amount: '',
      currency: V2V3_CURRENCY_ETH,
    })
    act(() => {
      result.current.onCurrencyChange()
    })
    expect(result.current.value).toEqual({
      amount: '',
      currency: V2V3_CURRENCY_USD,
    })
  })
})
