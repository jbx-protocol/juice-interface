import { AppWrapper } from 'components/common'
import { ProjectSafeDashboard } from 'components/ProjectSafeDashboard'
import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { V2V3ProjectContext } from 'contexts/v2v3/V2V3ProjectContext'
import { CV2V3 } from 'models/cv'
import { ProjectMetadataV5 } from 'models/project-metadata'
import { GetServerSideProps } from 'next'
import { TransactionProvider } from 'providers/TransactionProvider'
import { V2V3ProjectPageProvider } from 'providers/v2v3/V2V3ProjectPageProvider'
import { useContext } from 'react'
import { v2v3ProjectRoute } from 'utils/routes'
import { getProjectProps, ProjectPageProps } from 'utils/server/pages/props'

export const getServerSideProps: GetServerSideProps<
  ProjectPageProps
> = async context => {
  if (!context.params) throw new Error('params not supplied')

  const projectId = parseInt(context.params.projectId as string)
  return getProjectProps(projectId)
}

function V2V3ProjectSafeDashboard() {
  const { handle, projectOwnerAddress } = useContext(V2V3ProjectContext)
  const { projectId } = useContext(ProjectMetadataContext)

  if (!projectOwnerAddress) return null
  return (
    <ProjectSafeDashboard
      projectPageUrl={v2v3ProjectRoute({ handle, projectId })}
      projectOwnerAddress={projectOwnerAddress}
    />
  )
}

export default function V2V3ProjectSafeDashboardPage({
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
          <V2V3ProjectSafeDashboard />
        </TransactionProvider>
      </V2V3ProjectPageProvider>
    </AppWrapper>
  )
}
