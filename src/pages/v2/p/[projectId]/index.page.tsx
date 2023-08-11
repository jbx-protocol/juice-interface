import Loading from 'components/Loading'
import { AppWrapper, SEO } from 'components/common'
import { V2V3Dashboard } from 'components/v2v3/V2V3Project/V2V3Dashboard'
import { FEATURE_FLAGS } from 'constants/featureFlags'
import { PV_V2 } from 'constants/pv'
import { AnnouncementsProvider } from 'contexts/Announcements/AnnouncementsProvider'
import { V2V3ProjectPageProvider } from 'contexts/v2v3/V2V3ProjectPageProvider'
import { paginateDepleteProjectsQueryCall } from 'lib/apollo/paginateDepleteProjectsQuery'
import { ProjectMetadata } from 'models/projectMetadata'
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next'
import { Suspense, lazy } from 'react'
import { featureFlagEnabled } from 'utils/featureFlags'
import { cidFromUrl, ipfsPublicGatewayUrl } from 'utils/ipfs'
import {
  ProjectPageProps,
  getProjectStaticProps,
} from 'utils/server/pages/props'
const ProjectDashboard = lazy(() => import('components/ProjectDashboard'))

export const getStaticPaths: GetStaticPaths = async () => {
  if (process.env.BUILD_CACHE_V2_PROJECTS === 'true') {
    const projects = await paginateDepleteProjectsQueryCall({
      variables: { where: { pv: PV_V2 } },
    })
    const paths = projects.map(({ projectId }) => ({
      params: { projectId: String(projectId) },
    }))
    return { paths, fallback: true }
  }

  // TODO: We are switching to blocking as blocking fallback as its just not
  // working. Need to investigate further
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps<
  ProjectPageProps
> = async context => {
  if (!context.params) throw new Error('params not supplied')

  const projectId = parseInt(context.params.projectId as string)
  const props = await getProjectStaticProps(projectId)

  return {
    ...props,
    revalidate: 10, // 10 seconds https://nextjs.org/docs/api-reference/data-fetching/get-static-props#revalidate
  }
}

const ProjectPageSEO = ({
  metadata,
  projectId,
}: {
  metadata?: ProjectMetadata
  projectId: number
}) => (
  <SEO
    // Set known values, leave others undefined to be overridden
    title={metadata?.name}
    url={`${process.env.NEXT_PUBLIC_BASE_URL}v2/p/${projectId}`}
    description={metadata?.description}
    twitter={{
      card: 'summary',
      creator: metadata?.twitter,
      handle: metadata?.twitter,
      // Swap out all gateways with ipfs.io public gateway until we can resolve our meta tag issue.
      image: metadata?.logoUri
        ? ipfsPublicGatewayUrl(cidFromUrl(metadata.logoUri))
        : undefined,
    }}
  />
)

export default function V2ProjectPage({
  metadata,
  projectId,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const newProjectPageEnabled = featureFlagEnabled(
    FEATURE_FLAGS.NEW_PROJECT_PAGE,
  )

  return (
    <>
      <ProjectPageSEO metadata={metadata} projectId={projectId} />

      <AppWrapper>
        <V2V3ProjectPageProvider projectId={projectId} metadata={metadata}>
          <AnnouncementsProvider>
            {newProjectPageEnabled ? (
              <Suspense fallback={<Loading />}>
                <ProjectDashboard />
              </Suspense>
            ) : (
              <V2V3Dashboard />
            )}
          </AnnouncementsProvider>
        </V2V3ProjectPageProvider>
      </AppWrapper>
    </>
  )
}
