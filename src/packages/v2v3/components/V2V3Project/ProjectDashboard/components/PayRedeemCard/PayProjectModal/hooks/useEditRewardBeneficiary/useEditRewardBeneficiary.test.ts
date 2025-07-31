/**
 * @jest-environment jsdom
 */
import { act, renderHook } from '@testing-library/react-hooks'
import { useEditRewardBeneficiary } from './useEditRewardBeneficiary'

jest.mock('hooks/Wallet', () => ({
  useWallet: () => ({
    userAddress: 'userAddress',
  }),
}))

describe('useEditRewardBeneficiary', () => {
  it('should return the correct values', () => {
    const { result } = renderHook(() =>
      useEditRewardBeneficiary(undefined, undefined),
    )
    expect(result.current).toEqual({
      isEditing: false,
      isLoading: false,
      address: 'userAddress',
      editClicked: expect.any(Function),
      handleInputChanged: expect.any(Function),
      handleInputBlur: expect.any(Function),
    })
  })

  it('should call dispatch with the correct value when editClicked is called', () => {
    const { result } = renderHook(() =>
      useEditRewardBeneficiary(undefined, undefined),
    )
    act(() => {
      result.current.editClicked()
    })
    expect(result.current).toEqual({
      isEditing: true,
      isLoading: false,
      address: 'userAddress',
      editClicked: expect.any(Function),
      handleInputChanged: expect.any(Function),
      handleInputBlur: expect.any(Function),
    })
  })
})
