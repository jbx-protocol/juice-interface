import { AppWrapper, SEO } from 'components/common'
import { DesmosScript } from 'components/common/Head/scripts/DesmosScript'
import { FeedbackFormButton } from 'components/FeedbackFormButton'
import Loading from 'components/Loading'
import NewDeployNotAvailable from 'components/NewDeployNotAvailable'
import Project404 from 'components/Project404'
import ScrollToTopButton from 'components/ScrollToTopButton'
import { V1Project } from 'components/v1/V1Project'
import { CV_V1, CV_V1_1 } from 'constants/cv'
import { layouts } from 'constants/styles/layouts'
import { V1ProjectContext } from 'contexts/v1/projectContext'
import { paginateDepleteProjectsQueryCall } from 'lib/apollo'
import { ProjectMetadataV5 } from 'models/project-metadata'
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next'
import { useRouter } from 'next/router'
import { V1UserProvider } from 'providers/v1/UserProvider'
import { V1CurrencyProvider } from 'providers/v1/V1CurrencyProvider'
import { V1ProjectProvider } from 'providers/v1/V1ProjectProvider'
import { useContext } from 'react'
import { findProjectMetadata } from 'utils/server'

export const getStaticPaths: GetStaticPaths = async () => {
  if (process.env.BUILD_CACHE_V1_PROJECTS === 'true') {
    const projects = await paginateDepleteProjectsQueryCall({
      variables: {
        where: { cv_in: [CV_V1, CV_V1_1] },
      },
    })
    const paths = projects
      .map(({ handle }) =>
        handle
          ? {
              params: { handle },
            }
          : undefined,
      )
      .filter((i): i is { params: { handle: string } } => !!i)
    return { paths, fallback: true }
  }

  return { paths: [{ params: { handle: 'juicebox' } }], fallback: true }
}

export const getStaticProps: GetStaticProps<{
  metadata: ProjectMetadataV5
  handle: string
}> = async context => {
  if (!context.params) throw new Error('params not supplied')
  const handle = context.params.handle as string
  const projects = await paginateDepleteProjectsQueryCall({
    variables: {
      where: { cv_in: [CV_V1, CV_V1_1], handle },
      first: 1,
    },
  })
  if (!projects[0]?.metadataUri) {
    console.error(
      `Failed to load metadata uri for ${JSON.stringify(context.params)}`,
    )
    return { notFound: true }
  }

  try {
    const metadata = await findProjectMetadata({
      metadataCid: projects[0].metadataUri,
    })
    return { props: { metadata, handle } }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    if (e?.response?.status === 404 || e?.response?.status === 400) {
      return { notFound: true }
    }
    throw e
  }
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
            <V1ProjectProvider handle={handle} metadata={metadata}>
              <V1CurrencyProvider>
                <V1Dashboard />
              </V1CurrencyProvider>
            </V1ProjectProvider>
          </V1UserProvider>
        ) : (
          <Loading />
        )}
      </AppWrapper>
    </>
  )
}

function V1Dashboard() {
  const { projectId } = useContext(V1ProjectContext)
  const router = useRouter()

  // Checks URL to see if user was just directed from project deploy
  const handle = router.query.handle as string
  const isNewDeploy = Boolean(router.query.newDeploy)

  if (!handle) return <Project404 projectId={handle} />
  if (!projectId) return <Loading />
  if (projectId === 0) {
    if (isNewDeploy) {
      return <NewDeployNotAvailable handleOrId={handle} />
    }

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
