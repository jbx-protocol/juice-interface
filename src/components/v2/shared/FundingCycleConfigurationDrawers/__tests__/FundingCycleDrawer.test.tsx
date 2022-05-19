import { act, renderHook } from '@testing-library/react-hooks'

import { useFundingCycleDrawer } from '../useFundingCycleDrawer'

describe('FundingCycleDrawer', () => {
  describe('useFundingCycleDrawer', () => {
    const instanceUnderTest = (onClose: VoidFunction = () => {}) => {
      const { result } = renderHook(() => useFundingCycleDrawer(onClose))
      return result
    }
    test('calls onClose when emitDrawerClose is called', () => {
      const callback = jest.fn()
      const result = instanceUnderTest(callback)
      result.current.emitDrawerClose()
      expect(callback).toHaveBeenCalled()
    })

    test('updatesForm on setFormUpdated', () => {
      const result = instanceUnderTest()
      expect(result.current.formUpdated).toEqual(false)
      act(() => result.current.setFormUpdated(true))
      expect(result.current.formUpdated).toEqual(true)
    })

    test('openModal and closeModal updates unsavedChangesModalVisible', () => {
      const result = instanceUnderTest()
      expect(result.current.unsavedChangesModalVisible).toEqual(false)
      act(() => result.current.openModal())
      expect(result.current.unsavedChangesModalVisible).toBe(true)
      act(() => result.current.closeModal())
      expect(result.current.unsavedChangesModalVisible).toEqual(false)
    })

    test('handleDrawCloseClick when form not updated will close drawer', () => {
      let drawerWasClosed = false
      const result = instanceUnderTest(() => (drawerWasClosed = true))
      act(() => {
        result.current.handleDrawerCloseClick()
      })
      expect(drawerWasClosed).toEqual(true)
      expect(result.current.unsavedChangesModalVisible).toEqual(false)
    })

    test('handleDrawCloseClick when form updated will open modal and not close drawer', () => {
      let drawerWasClosed = false
      const result = instanceUnderTest(() => (drawerWasClosed = true))
      act(() => result.current.setFormUpdated(true))
      act(() => {
        result.current.handleDrawerCloseClick()
      })
      expect(result.current.unsavedChangesModalVisible).toEqual(true)
      expect(drawerWasClosed).toEqual(false)
    })
  })
})
