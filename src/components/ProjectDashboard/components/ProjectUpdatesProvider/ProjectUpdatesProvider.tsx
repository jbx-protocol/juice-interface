import { createContext, useEffect } from 'react'
import { useProjectUpdates } from './hooks/useProjectUpdates'

export type ProjectUpdate = {
  id: string
  title: string
  message: string
  imageUrl: string | undefined
  createdAt: Date
  posterWallet: string
}

type ProjectUpdatesContextType = ReturnType<typeof useProjectUpdates>

export const ProjectUpdatesContext = createContext<ProjectUpdatesContextType>({
  loading: false,
  projectUpdates: [],
  error: undefined,
  loadProjectUpdates: async () => {
    console.error('loadProjectUpdates was called before it was initialized')
  },
})

export const ProjectUpdatesProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const { loadProjectUpdates, ...projectUpdates } = useProjectUpdates()

  useEffect(() => {
    loadProjectUpdates()
  }, [loadProjectUpdates])

  return (
    <ProjectUpdatesContext.Provider
      value={{ loadProjectUpdates, ...projectUpdates }}
    >
      {children}
    </ProjectUpdatesContext.Provider>
  )
}
