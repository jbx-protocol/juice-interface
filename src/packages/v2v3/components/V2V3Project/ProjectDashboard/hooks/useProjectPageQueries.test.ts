/**
 * @jest-environment jsdom
 */
import { act, renderHook } from '@testing-library/react-hooks'
import { useRouter } from 'next/router'
import { useProjectPageQueries } from './useProjectPageQueries'

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}))

describe('useProjectPageQueries', () => {
  const pushMock = jest.fn()
  const replaceMock = jest.fn()

  beforeEach(() => {
    pushMock.mockReset()
    replaceMock.mockReset()
    ;(useRouter as jest.Mock).mockReturnValue({
      query: {
        tabid: 'tabid',
      },
      push: pushMock,
      replace: replaceMock,
    })
  })

  it('should return projectPageTab', () => {
    const { result } = renderHook(() => useProjectPageQueries())
    expect(result.current.projectPageTab).toEqual('tabid')
  })

  test('setProjectPageTab should call router.push', () => {
    const { result } = renderHook(() => useProjectPageQueries())
    act(() => {
      result.current.setProjectPageTab('foobar')
    })
    expect(replaceMock).toHaveBeenCalled()
    expect(replaceMock).toHaveBeenCalledWith(
      { pathname: undefined, query: { tabid: 'foobar', projectId: undefined } },
      undefined,
      { shallow: true },
    )
  })
})
