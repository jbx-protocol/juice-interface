import { createContext } from 'react'
import { AnyPromiseFn } from 'utils/types'

export const PageContext: React.Context<
  Partial<{
    isHidden: boolean
    canGoBack: boolean
    isFinalPage: boolean
    doneText: string | undefined
    goToNextPage: () => void
    goToPreviousPage: () => void
    addValidator: (validator: AnyPromiseFn) => string
    removeValidator: (id: string) => void
  }>
> = createContext({})
