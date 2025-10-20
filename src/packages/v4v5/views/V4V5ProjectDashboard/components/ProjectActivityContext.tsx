import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useMemo,
  useState,
} from 'react'

interface ProjectActivityContextType {
  isOpen: boolean
  open: () => void
  close: () => void
  toggle: () => void
}

const ProjectActivityContext = createContext<
  ProjectActivityContextType | undefined
>(undefined)

export const useProjectActivity = () => {
  const context = useContext(ProjectActivityContext)
  if (!context) {
    throw new Error(
      'useProjectActivity must be used within ProjectActivityProvider',
    )
  }
  return context
}

export const ProjectActivityProvider: React.FC<PropsWithChildren> = ({
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
    <ProjectActivityContext.Provider value={value}>
      {children}
    </ProjectActivityContext.Provider>
  )
}
