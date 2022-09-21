import ScrollToTopButton from 'components/ScrollToTopButton'
import V2Project from 'components/v2/V2Project'
import { layouts } from 'constants/styles/layouts'
import { ProjectMetadataV5 } from 'models/project-metadata'
import { V2NftRewardsProvider } from 'providers/v2/V2NftRewardsProvider'
import V2ProjectMetadataProvider from 'providers/v2/V2ProjectMetadataProvider'
import V2ProjectProvider from 'providers/v2/V2ProjectProvider'
import { VeNftProvider } from 'providers/v2/VeNftProvider'

export default function V2Dashboard({
  projectId,
  metadata,
}: {
  projectId: number
  metadata: ProjectMetadataV5
}) {
  return (
    <div style={layouts.maxWidth}>
      <V2ProjectMetadataProvider projectId={projectId} metadata={metadata}>
        <V2ProjectProvider projectId={projectId}>
          <V2NftRewardsProvider>
            <VeNftProvider projectId={projectId}>
              <V2Project />
            </VeNftProvider>
          </V2NftRewardsProvider>
        </V2ProjectProvider>
      </V2ProjectMetadataProvider>

      <div style={{ textAlign: 'center', marginTop: '3rem' }}>
        <ScrollToTopButton />
      </div>
    </div>
  )
}
