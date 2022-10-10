import { createContext } from 'react'

export const PageContext: React.Context<
  Partial<{
    pageName: string
    isHidden: boolean
    canGoBack: boolean
    isFinalPage: boolean
    doneText: string | undefined
    goToNextPage: () => void
    goToPreviousPage: () => void
  }>
> = createContext({})
