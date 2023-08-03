import { useModal } from 'hooks/useModal'
import React, { PropsWithChildren, useEffect } from 'react'
import { QuickProjectSearchContext } from './QuickProjectSearchContext'
import { QuickProjectSearchModal } from './QuickProjectSearchModal'

const HOT_KEY = 'k'

export const QuickProjectSearchProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const modal = useModal()

  // Hot key listener to open modal
  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (e.isComposing) return // i think right idk

      if (e.key === HOT_KEY && (e.metaKey || e.ctrlKey)) {
        modal.open()
        e.preventDefault() // Needed to prevent browsers from using default function for quick search command. Some browsers use cmd/ctrl + k to focus url bar
      }
    }

    window.addEventListener('keydown', listener)

    return () => {
      window.removeEventListener('keydown', listener)
    }
  }, [modal])

  return (
    <QuickProjectSearchContext.Provider value={{ modal }}>
      {children}
      <QuickProjectSearchModal />
    </QuickProjectSearchContext.Provider>
  )
}
