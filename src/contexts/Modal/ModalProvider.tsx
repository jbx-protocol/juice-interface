import { useState } from 'react'
import { ModalContext } from './ModalContext'

export const ModalProvider: React.FC<React.PropsWithChildren<unknown>> = ({
  children,
}) => {
  const [open, setOpen] = useState<boolean>(false)

  const openModal = () => {
    setOpen(true)
  }

  const closeModal = () => {
    setOpen(false)
  }

  return (
    <ModalContext.Provider
      value={{
        open,
        openModal,
        closeModal,
      }}
    >
      {children}
    </ModalContext.Provider>
  )
}
