import { createContext } from 'react'

export const AnnouncementsContext: React.Context<{
  activeId: string | undefined
  setActiveId: (id: string | undefined) => void
}> = createContext({
  activeId: undefined as string | undefined,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setActiveId: (_id: string | undefined) => {
    console.error('AnnouncementsContext::setActiveId not implemented')
  },
})
