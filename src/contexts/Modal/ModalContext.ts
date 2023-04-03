import { createContext } from 'react'

type ModalContextType = {
  openModal: () => void
  closeModal: () => void
  open: boolean
}

export const ModalContext = createContext<ModalContextType>({
  openModal: () => {
    console.error('ModalContext.openModal called but no provider set')
  },
  closeModal: () => {
    console.error('ModalContext.closeModal called but no provider set')
  },
  open: false,
})
