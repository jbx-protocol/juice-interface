import { PropsWithChildren } from 'react'
import { V2V3ProjectContext } from './V2V3ProjectContext'
import { useV2V3ProjectState } from './useV2V3ProjectState'

export default function V2V3ProjectProvider({
  projectId,
  children,
}: PropsWithChildren<{
  projectId: number
}>) {
  const project = useV2V3ProjectState({ projectId })

  return (
    <V2V3ProjectContext.Provider value={project}>
      {children}
    </V2V3ProjectContext.Provider>
  )
}
