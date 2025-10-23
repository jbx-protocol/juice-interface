import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
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

const STORAGE_KEY = 'protocolActivityPanelOpen'

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
  // Initialize state from localStorage, default to true if not set
  const [isOpen, setIsOpen] = useState(() => {
    if (typeof window === 'undefined') return true
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored !== null ? stored === 'true' : true
  })

  // Persist state changes to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, String(isOpen))
  }, [isOpen])

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
