import { createContext, ReactNode } from 'react'

export const PageContext: React.Context<
  Partial<{
    pageName: string
    isHidden: boolean
    canGoBack: boolean
    isFinalPage: boolean
    doneText: ReactNode
    goToNextPage: () => void
    goToPreviousPage: () => void
    lockPageProgress: () => void
    unlockPageProgress: () => void
  }>
> = createContext({})
