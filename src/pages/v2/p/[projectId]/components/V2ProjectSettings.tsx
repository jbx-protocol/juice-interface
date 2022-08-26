import ScrollToTopButton from 'components/ScrollToTopButton'
import V2ProjectSettings from 'components/v2/V2Project/V2ProjectSettings/V2ProjectSettings'
import { layouts } from 'constants/styles/layouts'
import { ProjectMetadataV4 } from 'models/project-metadata'
import V2ProjectProvider from 'providers/v2/V2ProjectProvider'

export default function V2Dashboard({
  projectId,
  metadata,
}: {
  projectId: number
  metadata: ProjectMetadataV4
}) {
  return (
    <V2ProjectProvider projectId={projectId} metadata={metadata}>
      <div style={layouts.maxWidth}>
        <V2ProjectSettings />
        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <ScrollToTopButton />
        </div>
      </div>
    </V2ProjectProvider>
  )
}
