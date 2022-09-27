import { AppWrapper } from 'components/common'
import { ProjectSafeDashboard } from 'components/v2v3/V2V3Project/ProjectSafeDashboard'
import { V2CVType, V3CVType } from 'models/cv'
import { ProjectMetadataV5 } from 'models/project-metadata'
import { GetServerSideProps } from 'next'
import { TransactionProvider } from 'providers/TransactionProvider'
import { V2V3ContractsProvider } from 'providers/v2v3/V2V3ContractsProvider'

import V2V3ProjectMetadataProvider from 'providers/v2v3/V2V3ProjectMetadataProvider'
import V2V3ProjectProvider from 'providers/v2v3/V2V3ProjectProvider'
import { getProjectProps, ProjectPageProps } from '../utils/props'

export const getServerSideProps: GetServerSideProps<
  ProjectPageProps
> = async context => {
  if (!context.params) throw new Error('params not supplied')

  const projectId = parseInt(context.params.projectId as string)
  return getProjectProps(projectId)
}

export default function ProjectSafeDashboardPage({
  projectId,
  metadata,
  cv,
}: {
  projectId: number
  metadata: ProjectMetadataV5
  cv: V3CVType | V2CVType
}) {
  return (
    <AppWrapper>
      <V2V3ContractsProvider initialCv={cv}>
        <TransactionProvider>
          <V2V3ProjectMetadataProvider
            projectId={projectId}
            metadata={metadata}
          >
            <V2V3ProjectProvider projectId={projectId}>
              <ProjectSafeDashboard />
            </V2V3ProjectProvider>
          </V2V3ProjectMetadataProvider>
        </TransactionProvider>
      </V2V3ContractsProvider>
    </AppWrapper>
  )
}
