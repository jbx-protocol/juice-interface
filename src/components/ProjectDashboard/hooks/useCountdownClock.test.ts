/**
 * @jest-environment jsdom
 */
import { act, renderHook } from '@testing-library/react'
import { useCountdownClock } from './useCountdownClock'
describe('useCountdownClock', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })
  it('returns empty string if endSeconds is undefined', () => {
    const { result } = renderHook(() => useCountdownClock(undefined))
    expect(result.current).toEqual('')
  })

  it('returns remaining time', () => {
    const now = Date.now() / 1000
    const tenSecondsFromNow = now + 10
    const { result } = renderHook(() => useCountdownClock(tenSecondsFromNow))
    expect(result.current).toEqual('0d 0h 0m 10s')
  })
  it('updates every second', () => {
    const now = Date.now() / 1000
    const tenSecondsFromNow = now + 10
    const { result } = renderHook(() => useCountdownClock(tenSecondsFromNow))
    for (let i = 10; i >= 0; i--) {
      expect(result.current).toEqual(`0d 0h 0m ${i}s`)
      act(() => jest.advanceTimersByTime(1000))
    }
  })

  test('time remaining does not go negative', () => {
    const now = Date.now() / 1000
    const tenSecondsAgo = now - 10
    const { result } = renderHook(() => useCountdownClock(tenSecondsAgo))
    expect(result.current).toEqual('0d 0h 0m 0s')
  })

  test('timer is cleared on unmount', () => {
    const now = Date.now() / 1000
    const tenSecondsFromNow = now + 10
    const { result, unmount } = renderHook(() =>
      useCountdownClock(tenSecondsFromNow),
    )
    expect(result.current).toEqual('0d 0h 0m 10s')
    act(() => {
      jest.advanceTimersByTime(1000)
    })
    expect(result.current).toEqual('0d 0h 0m 9s')
    unmount()
    act(() => {
      jest.advanceTimersByTime(1000)
    })
    expect(result.current).toEqual('0d 0h 0m 9s')
  })
})
