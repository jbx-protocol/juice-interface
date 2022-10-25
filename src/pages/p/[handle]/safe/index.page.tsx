import { AppWrapper } from 'components/common'
import Loading from 'components/Loading'
import { ProjectSafeDashboard } from 'components/ProjectSafeDashboard'
import { V1ProjectContext } from 'contexts/v1/projectContext'
import { ProjectMetadataV5 } from 'models/project-metadata'
import { GetStaticProps, InferGetStaticPropsType } from 'next'
import { V1UserProvider } from 'providers/v1/UserProvider'
import { V1ProjectMetadataProvider } from 'providers/v1/V1ProjectMetadataProvider'
import { V1ProjectProvider } from 'providers/v1/V1ProjectProvider'
import { useContext } from 'react'
import { getV1StaticProps } from '../pageLoaders'

export const getStaticProps: GetStaticProps<{
  metadata: ProjectMetadataV5
  handle: string
}> = async context => {
  return getV1StaticProps(context)
}

function V1ProjectSafeDashboard({ handle }: { handle: string }) {
  const { owner } = useContext(V1ProjectContext)
  if (!owner) return null
  return (
    <ProjectSafeDashboard
      projectPageUrl={`/p/${handle}`}
      projectOwnerAddress={owner}
    />
  )
}

export default function V1ProjectSafeDashboardPage({
  handle,
  metadata,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <AppWrapper>
      {metadata ? (
        <V1UserProvider>
          <V1ProjectMetadataProvider handle={handle} metadata={metadata}>
            <V1ProjectProvider handle={handle}>
              <V1ProjectSafeDashboard handle={handle} />
            </V1ProjectProvider>
          </V1ProjectMetadataProvider>
        </V1UserProvider>
      ) : (
        <Loading />
      )}
    </AppWrapper>
  )
}
