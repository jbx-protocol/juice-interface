import { V1ProjectContext } from 'packages/v1/contexts/Project/V1ProjectContext'
import { useV1ProjectState } from 'packages/v1/contexts/Project/useV1ProjectState'

export const V1ProjectProvider: React.FC<
  React.PropsWithChildren<{
    handle: string
  }>
> = ({ children, handle }) => {
  const project = useV1ProjectState({ handle })

  return (
    <V1ProjectContext.Provider value={project}>
      {children}
    </V1ProjectContext.Provider>
  )
}
