import { AppWrapper } from 'components/common'
import { ProjectSafeDashboard } from 'components/ProjectSafeDashboard'
import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { V2V3ProjectContext } from 'contexts/v2v3/V2V3ProjectContext'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
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
  initialCv,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <AppWrapper>
      <V2V3ProjectPageProvider
        projectId={projectId}
        metadata={metadata}
        initialCv={initialCv}
      >
        <TransactionProvider>
          <V2V3ProjectSafeDashboard />
        </TransactionProvider>
      </V2V3ProjectPageProvider>
    </AppWrapper>
  )
}
