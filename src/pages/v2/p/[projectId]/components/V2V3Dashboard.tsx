import ScrollToTopButton from 'components/ScrollToTopButton'
import { V2V3Project } from 'components/v2v3/V2V3Project'
import { layouts } from 'constants/styles/layouts'
import { ProjectMetadataV5 } from 'models/project-metadata'
import { TransactionProvider } from 'providers/TransactionProvider'
import { NftRewardsProvider } from 'providers/v2v3/NftRewardsProvider'
import V2V3ProjectMetadataProvider from 'providers/v2v3/V2V3ProjectMetadataProvider'
import V2V3ProjectProvider from 'providers/v2v3/V2V3ProjectProvider'
import { VeNftProvider } from 'providers/v2v3/VeNftProvider'

export function V2V3Dashboard({
  projectId,
  metadata,
}: {
  projectId: number
  metadata: ProjectMetadataV5
}) {
  return (
    <div style={layouts.maxWidth}>
      <TransactionProvider>
        <V2V3ProjectMetadataProvider projectId={projectId} metadata={metadata}>
          <V2V3ProjectProvider projectId={projectId}>
            <NftRewardsProvider>
              <VeNftProvider projectId={projectId}>
                <V2V3Project />
              </VeNftProvider>
            </NftRewardsProvider>
          </V2V3ProjectProvider>
        </V2V3ProjectMetadataProvider>
      </TransactionProvider>

      <div style={{ textAlign: 'center', marginTop: '3rem' }}>
        <ScrollToTopButton />
      </div>
    </div>
  )
}
