import { AppWrapper } from 'components/common'
import { V2ProjectSettings } from 'components/v2/V2Project/V2ProjectSettings'
import { ProjectMetadataV4 } from 'models/project-metadata'
import { GetServerSideProps } from 'next'
import { V2UserProvider } from 'providers/v2/UserProvider'
import V2ProjectProvider from 'providers/v2/V2ProjectProvider'
import { getProjectProps, ProjectPageProps } from '../utils/props'

export const getServerSideProps: GetServerSideProps<
  ProjectPageProps
> = async context => {
  if (!context.params) throw new Error('params not supplied')

  const projectId = parseInt(context.params.projectId as string)
  return getProjectProps(projectId)
}

export default function V2ProjectSettingsPage({
  projectId,
  metadata,
}: {
  projectId: number
  metadata: ProjectMetadataV4
}) {
  return (
    <AppWrapper>
      <V2UserProvider>
        <V2ProjectProvider projectId={projectId} metadata={metadata}>
          <V2ProjectSettings />
        </V2ProjectProvider>
      </V2UserProvider>
    </AppWrapper>
  )
}
