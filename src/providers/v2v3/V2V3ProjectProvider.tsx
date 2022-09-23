import { V2V3ProjectContext } from 'contexts/v2v3/V2V3ProjectContext'
import { useV2V3ProjectState } from 'hooks/v2v3/V2V3ProjectState'
import { PropsWithChildren } from 'react'

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
