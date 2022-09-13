import { AppWrapper, SEO } from 'components/common'
import { DesmosScript } from 'components/common/Head/scripts/DesmosScript'
import Loading from 'components/Loading'
import { V2_PROJECT_IDS } from 'constants/v2/projectIds'
import {
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsResult,
  InferGetStaticPropsType,
} from 'next'
import {
  getProjectProps,
  ProjectPageProps,
} from 'pages/v2/p/[projectId]/utils/props'
import { V3UserProvider } from 'providers/v3/V3UserProvider'
import { paginateDepleteProjectsQueryCall } from 'utils/apollo'
import V3Dashboard from './components/V3Dashboard'

export const getStaticPaths: GetStaticPaths = async () => {
  if (process.env.BUILD_CACHE_V2_PROJECTS === 'true') {
    const projects = await paginateDepleteProjectsQueryCall({
      variables: { where: { cv: '2' } },
    })
    const paths = projects.map(({ projectId }) => ({
      params: { projectId: String(projectId) },
    }))
    return { paths, fallback: true }
  }

  return {
    paths: [{ params: { projectId: String(V2_PROJECT_IDS.JUICEBOX_DAO) } }],
    fallback: true,
  }
}

export const getStaticProps: GetStaticProps<
  ProjectPageProps
> = async context => {
  if (!context.params) throw new Error('params not supplied')

  const projectId = parseInt(context.params.projectId as string)
  return getProjectProps(projectId) as Promise<
    GetStaticPropsResult<ProjectPageProps>
  >
}

export default function V3ProjectPage({
  metadata,
  projectId,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      {metadata ? (
        <SEO
          title={metadata.name}
          url={`${process.env.NEXT_PUBLIC_BASE_URL}v2/p/${projectId}`}
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
        <V3UserProvider>
          {metadata ? (
            <V3Dashboard metadata={metadata} projectId={projectId} />
          ) : (
            <Loading />
          )}
        </V3UserProvider>
      </AppWrapper>
    </>
  )
}
