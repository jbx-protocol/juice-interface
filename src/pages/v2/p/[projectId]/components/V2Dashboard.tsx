import ScrollToTopButton from 'components/ScrollToTopButton'
import V2Project from 'components/v2/V2Project'
import { layouts } from 'constants/styles/layouts'
import { ProjectMetadataV4 } from 'models/project-metadata'
import V2ProjectMetadataProvider from 'providers/v2/V2ProjectMetadataProvider'
import V2ProjectProvider from 'providers/v2/V2ProjectProvider'

export default function V2Dashboard({
  projectId,
  metadata,
}: {
  projectId: number
  metadata: ProjectMetadataV4
}) {
  return (
    <div style={layouts.maxWidth}>
      <V2ProjectMetadataProvider projectId={projectId} metadata={metadata}>
        <V2ProjectProvider projectId={projectId}>
          <V2Project />
        </V2ProjectProvider>
      </V2ProjectMetadataProvider>

      <div style={{ textAlign: 'center', marginTop: '3rem' }}>
        <ScrollToTopButton />
      </div>
    </div>
  )
}
