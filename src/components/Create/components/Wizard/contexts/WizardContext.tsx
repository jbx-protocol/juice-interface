import { createContext } from 'react'
import { PageProps } from '../Page'

export const WizardContext: React.Context<
  Partial<{
    currentPage: string
    goToPage: (page: string) => void
    pages: PageProps[]
    doneText: string
  }>
> = createContext({})
