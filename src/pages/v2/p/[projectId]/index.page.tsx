import { AppWrapper, SEO } from 'components/common'
import Project404 from 'components/Project404'
import { PV_V2 } from 'constants/pv'
import { V2V3ProjectPageProvider } from 'contexts/v2v3/V2V3ProjectPageProvider'
import { paginateDepleteProjectsQueryCall } from 'lib/apollo'
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next'
import {
  getProjectStaticProps,
  ProjectPageProps,
} from 'utils/server/pages/props'
import { V2V3Dashboard } from './components/V2V3Dashboard'
import { cidFromUrl, ipfsPublicGatewayUrl } from 'utils/ipfs'

export const getStaticPaths: GetStaticPaths = async () => {
  if (process.env.BUILD_CACHE_V2_PROJECTS === 'true') {
    const projects = await paginateDepleteProjectsQueryCall({
      variables: { where: { pv: PV_V2 } },
    })
    const paths = projects.map(({ projectId }) => ({
      params: { projectId: String(projectId) },
    }))
    return { paths, fallback: 'blocking' }
  }

  // TODO: We are switching to blocking as blocking fallback as its just not
  // working. Need to investigate further
  return {
    paths: [],
    fallback: 'blocking',
  }
}

const extractV2V3ProjectIdFromHandle = async (handle: string) => {
  if (!handle.startsWith('@')) return undefined

  handle = handle.slice(1)
  const handleDecoded = decodeURI(handle)

  let projects
  try {
    projects = await paginateDepleteProjectsQueryCall({
      variables: {
        where: { pv: PV_V2, handle: handleDecoded },
      },
    })
  } catch (e) {
    console.error('Failed to query projects', e)
    throw e
  }

  if (!projects.length) return undefined
  const projectId = projects[0].projectId
  return projectId
}

export const getStaticProps: GetStaticProps<
  ProjectPageProps
> = async context => {
  if (!context.params) throw new Error('params not supplied')
  try {
    let projectId = parseInt(context.params.projectId as string)
    if (context.params.projectId.toString().startsWith('@')) {
      const p = await extractV2V3ProjectIdFromHandle(
        context.params.projectId as string,
      )
      if (p) {
        projectId = p
      }
    }

    const props = await getProjectStaticProps(projectId)

    return {
      ...props,
      revalidate: 10, // 10 seconds https://nextjs.org/docs/api-reference/data-fetching/get-static-props#revalidate
    }
  } catch (e) {
    console.error('unexpected error', e)
    return { notFound: true }
  }
}

export default function V2ProjectPage({
  metadata,
  projectId,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
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
      <AppWrapper>
        {metadata ? (
          <V2V3ProjectPageProvider projectId={projectId} metadata={metadata}>
            <V2V3Dashboard />
          </V2V3ProjectPageProvider>
        ) : (
          <Project404 />
        )}
      </AppWrapper>
    </>
  )
}
