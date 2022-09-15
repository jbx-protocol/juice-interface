import { V2ProjectContext } from 'contexts/v2/projectContext'
import { useV2ProjectState } from 'hooks/v2/V2ProjectState'
import { PropsWithChildren } from 'react'

export default function V2ProjectProvider({
  projectId,
  children,
}: PropsWithChildren<{
  projectId: number
}>) {
  const project = useV2ProjectState({ projectId })

  return (
    <V2ProjectContext.Provider value={project}>
      {children}
    </V2ProjectContext.Provider>
  )
}
