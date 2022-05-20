import { useState, useCallback } from 'react'

/**
 * Provides State for Funding Cycle Drawers.
 */
export function useFundingCycleDrawer(onClose: VoidFunction) {
  const [unsavedChangesModalVisible, setUnsavedChangesModalVisible] =
    useState(false)

  const [formUpdated, setFormUpdated] = useState<boolean>(false)

  const emitDrawerClose = onClose

  const openModal = () => setUnsavedChangesModalVisible(true)
  const closeModal = () => setUnsavedChangesModalVisible(false)

  const handleDrawerCloseClick = useCallback(() => {
    if (!formUpdated) {
      return emitDrawerClose()
    }
    openModal()
  }, [formUpdated, emitDrawerClose])

  return {
    emitDrawerClose,
    formUpdated,
    setFormUpdated,
    unsavedChangesModalVisible,
    openModal,
    closeModal,
    handleDrawerCloseClick,
  }
}
