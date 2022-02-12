import ProjectHeader from 'components/shared/ProjectHeader'
import { V2ProjectContext } from 'contexts/v2/projectContext'
import { useContext } from 'react'

export default function V2Project() {
  const { projectId, metadata } = useContext(V2ProjectContext)
  if (!projectId) return null

  return (
    <div>
      <ProjectHeader projectId={projectId} metadata={metadata} />
    </div>
  )
}
