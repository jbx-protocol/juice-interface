import { createContext } from 'react'

export const AnnouncementsContext: React.Context<{
  setActiveId?: (id: string | undefined) => void
}> = createContext({})
