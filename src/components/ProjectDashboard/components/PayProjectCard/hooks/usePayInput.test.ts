/* eslint-disable @typescript-eslint/no-explicit-any */
import { act, renderHook } from '@testing-library/react-hooks'
import { usePayInput } from './usePayInput'

describe('usePayInput', () => {
  it('should show amount value updates onInputChange', () => {
    const { result } = renderHook(usePayInput)
    expect(result.current.value).toEqual({
      amount: '',
      currency: 'eth',
    })
    act(() => {
      result.current.onInputChange({ target: { value: '1' } } as any)
    })
    expect(result.current.value).toEqual({
      amount: '1',
      currency: 'eth',
    })
  })

  it('should show currency value updates onCurrencyChange', () => {
    const { result } = renderHook(usePayInput)
    expect(result.current.value).toEqual({
      amount: '',
      currency: 'eth',
    })
    act(() => {
      result.current.onCurrencyChange()
    })
    expect(result.current.value).toEqual({
      amount: '',
      currency: 'usd',
    })
  })
})
