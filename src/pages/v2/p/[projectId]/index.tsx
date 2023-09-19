import Loading from 'components/Loading'
import ProjectDashboard from 'components/ProjectDashboard'
import { AppWrapper, SEO } from 'components/common'
import { FEATURE_FLAGS } from 'constants/featureFlags'
import { PV_V2 } from 'constants/pv'
import { AnnouncementsProvider } from 'contexts/Announcements/AnnouncementsProvider'
import { V2V3ProjectPageProvider } from 'contexts/v2v3/V2V3ProjectPageProvider'
import { paginateDepleteProjectsQueryCall } from 'lib/apollo/paginateDepleteProjectsQuery'
import { loadCatalog } from 'locales/utils'
import { ProjectMetadata } from 'models/projectMetadata'
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next'
import React, { PropsWithChildren, Suspense, lazy } from 'react'
import { featureFlagEnabled } from 'utils/featureFlags'
import { cidFromUrl, ipfsPublicGatewayUrl } from 'utils/ipfs'
import {
  ProjectPageProps,
  getProjectStaticProps,
} from 'utils/server/pages/props'
const V2V3Dashboard = lazy(
  () => import('components/v2v3/V2V3Project/V2V3Dashboard'),
)

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
  ProjectPageProps & { i18n: unknown }
> = async context => {
  const locale = context.locale as string
  const messages = await loadCatalog(locale)
  const i18n = { locale, messages }

  if (!context.params) throw new Error('params not supplied')

  const projectId = parseInt(context.params.projectId as string)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const props = (await getProjectStaticProps(projectId)) as any
  if (props?.props) {
    props.props.i18n = i18n
  }

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

      <_Wrapper>
        <AppWrapper>
          <V2V3ProjectPageProvider projectId={projectId} metadata={metadata}>
            <AnnouncementsProvider>
              {newProjectPageEnabled ? (
                <ProjectDashboard />
              ) : (
                <Suspense fallback={<Loading />}>
                  <V2V3Dashboard />
                </Suspense>
              )}
            </AnnouncementsProvider>
          </V2V3ProjectPageProvider>
        </AppWrapper>
      </_Wrapper>
    </>
  )
}

// This is a hack to avoid SSR for now. At the moment when this is not applied to this page, you will see a rehydration error.
const _Wrapper: React.FC<PropsWithChildren> = ({ children }) => {
  const [hasMounted, setHasMounted] = React.useState(false)
  React.useEffect(() => {
    setHasMounted(true)
  }, [])
  if (!hasMounted) {
    return null
  }

  return <>{children}</>
}
