import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useMemo,
  useState,
} from 'react'

interface ProtocolActivityContextType {
  isOpen: boolean
  open: () => void
  close: () => void
  toggle: () => void
}

const ProtocolActivityContext = createContext<
  ProtocolActivityContextType | undefined
>(undefined)

export const useProtocolActivity = () => {
  const context = useContext(ProtocolActivityContext)
  if (!context) {
    throw new Error(
      'useProtocolActivity must be used within ProtocolActivityProvider',
    )
  }
  return context
}

export const ProtocolActivityProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState(true)

  const value = useMemo(
    () => ({
      isOpen,
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
      toggle: () => setIsOpen(prev => !prev),
    }),
    [isOpen],
  )

  return (
    <ProtocolActivityContext.Provider value={value}>
      {children}
    </ProtocolActivityContext.Provider>
  )
}
