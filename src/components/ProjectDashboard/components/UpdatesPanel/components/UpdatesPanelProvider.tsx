import { createContext } from 'react'
import { useProjectUpdates } from '../hooks/useProjectUpdates'

type UpdatesPanelContextType = ReturnType<typeof useProjectUpdates>

export const UpdatesPanelContext = createContext<UpdatesPanelContextType>({
  loading: false,
  projectUpdates: [],
  error: undefined,
  loadProjectUpdates: async () => {
    console.error('loadProjectUpdates was called before it was initialized')
  },
})

export const UpdatesPanelProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const projectUpdates = useProjectUpdates()

  return (
    <UpdatesPanelContext.Provider value={projectUpdates}>
      {children}
    </UpdatesPanelContext.Provider>
  )
}
