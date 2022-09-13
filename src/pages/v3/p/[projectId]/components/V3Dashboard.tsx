import ScrollToTopButton from 'components/ScrollToTopButton'
import V3Project from 'components/v3/V3Project'
import { layouts } from 'constants/styles/layouts'
import { ProjectMetadataV4 } from 'models/project-metadata'
import V3ProjectProvider from 'providers/v3/V3ProjectProvider'

export default function V3Dashboard({
  projectId,
  metadata,
}: {
  projectId: number
  metadata: ProjectMetadataV4
}) {
  return (
    <V3ProjectProvider projectId={projectId} metadata={metadata}>
      <div style={layouts.maxWidth}>
        <V3Project />
        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <ScrollToTopButton />
        </div>
      </div>
    </V3ProjectProvider>
  )
}
