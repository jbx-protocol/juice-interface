import { AppWrapper, SEO } from 'components/common'
import { DesmosScript } from 'components/common/Head/scripts/DesmosScript'
import { FeedbackFormButton } from 'components/FeedbackFormButton'
import Loading from 'components/Loading'
import Project404 from 'components/Project404'
import ScrollToTopButton from 'components/ScrollToTopButton'
import { V1Project } from 'components/v1/V1Project'
import { layouts } from 'constants/styles/layouts'
import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { ProjectMetadataV5 } from 'models/project-metadata'
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next'
import { useRouter } from 'next/router'
import { V1UserProvider } from 'providers/v1/UserProvider'
import { V1CurrencyProvider } from 'providers/v1/V1CurrencyProvider'
import { V1ProjectMetadataProvider } from 'providers/v1/V1ProjectMetadataProvider'
import { V1ProjectProvider } from 'providers/v1/V1ProjectProvider'
import { useContext } from 'react'
import { getV1StaticPaths, getV1StaticProps } from './pageLoaders'

export const getStaticPaths: GetStaticPaths = async context => {
  return getV1StaticPaths(context)
}

export const getStaticProps: GetStaticProps<{
  metadata: ProjectMetadataV5
  handle: string
}> = async context => {
  return getV1StaticProps(context)
}

export default function V1HandlePage({
  metadata,
  handle,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  // Checks URL to see if user was just directed from project deploy
  return (
    <>
      {metadata ? (
        <SEO
          title={metadata.name}
          url={`${process.env.NEXT_PUBLIC_BASE_URL}p/${handle}`}
          description={metadata.description}
          twitter={{
            card: 'summary',
            creator: metadata.twitter,
            handle: metadata.twitter,
            image: metadata.logoUri,
            site: metadata.twitter,
          }}
        >
          <DesmosScript />
        </SEO>
      ) : null}
      <AppWrapper>
        {metadata ? (
          <V1UserProvider>
            <V1ProjectMetadataProvider handle={handle} metadata={metadata}>
              <V1ProjectProvider handle={handle}>
                <V1CurrencyProvider>
                  <V1Dashboard />
                </V1CurrencyProvider>
              </V1ProjectProvider>
            </V1ProjectMetadataProvider>
          </V1UserProvider>
        ) : (
          <Loading />
        )}
      </AppWrapper>
    </>
  )
}

function V1Dashboard() {
  const { projectId } = useContext(ProjectMetadataContext)
  const router = useRouter()

  const handle = router.query.handle as string

  if (!handle) return <Project404 projectId={handle} />
  if (!projectId) return <Loading />
  if (projectId === 0) {
    return <Project404 projectId={handle} />
  }

  return (
    <div style={layouts.maxWidth}>
      <V1Project />
      <div style={{ textAlign: 'center', padding: 20 }}>
        <ScrollToTopButton />
      </div>
      <FeedbackFormButton projectHandle={handle} />
    </div>
  )
}
