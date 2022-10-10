import { AppWrapper } from 'components/common'
import { VeNft } from 'components/veNft/VeNft'
import { CV2V3 } from 'models/cv'
import { ProjectMetadataV5 } from 'models/project-metadata'
import { GetServerSideProps } from 'next'
import { TransactionProvider } from 'providers/TransactionProvider'
import { V2V3ProjectPageProvider } from 'providers/v2v3/V2V3ProjectPageProvider'
import { VeNftProvider } from 'providers/v2v3/VeNftProvider'
import { getProjectProps, ProjectPageProps } from 'utils/server/pages/props'

export const getServerSideProps: GetServerSideProps<
  ProjectPageProps
> = async context => {
  if (!context.params) throw new Error('params not supplied')

  const projectId = parseInt(context.params.projectId as string)
  return getProjectProps(projectId)
}

export default function V2V3ProjectSettingsPage({
  projectId,
  metadata,
  cv,
}: {
  projectId: number
  metadata: ProjectMetadataV5
  cv: CV2V3
}) {
  return (
    <AppWrapper>
      <V2V3ProjectPageProvider
        projectId={projectId}
        metadata={metadata}
        cv={cv}
      >
        <TransactionProvider>
          <VeNftProvider projectId={projectId}>
            <VeNft />
          </VeNftProvider>
        </TransactionProvider>
      </V2V3ProjectPageProvider>
    </AppWrapper>
  )
}
