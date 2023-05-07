import { useCallback, useState } from 'react'

/**
 * Hook for controlling modal state
 */
export const useModal = () => {
  const [visible, setVisible] = useState<boolean>(false)
  const open = useCallback(() => setVisible(true), [setVisible])
  const close = useCallback(() => setVisible(false), [setVisible])
  return { visible, open, close }
}
