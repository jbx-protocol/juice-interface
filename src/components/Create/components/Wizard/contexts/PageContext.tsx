import { createContext } from 'react'

export const PageContext: React.Context<
  Partial<{
    isHidden: boolean
    canGoBack: boolean
    isFinalPage: boolean
    doneText: string | undefined
    goToNextPage: () => void
    goToPreviousPage: () => void
  }>
> = createContext({})
