import { FEATURE_FLAGS } from 'constants/featureFlags'
import { PV_V5 } from 'constants/pv'
import { SiteBaseUrl } from 'constants/url'
import { jbUrn, toJbUrn } from 'juice-sdk-core'
import { loadCatalog } from 'locales/utils'
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next'
import dynamic from 'next/dynamic'
import { V4V5VersionProvider } from 'packages/v4v5/contexts/V4V5VersionProvider'
import React, { PropsWithChildren } from 'react'
import { featureFlagEnabled } from 'utils/featureFlags'
import { cidFromUrl, ipfsPublicGatewayUrl } from 'utils/ipfs'
import {
  getProjectStaticProps,
  ProjectPageProps,
} from 'utils/server/pages/props'
import { stripHtmlTags } from 'utils/string'
import type { SEOHeadProps } from 'components/SEOHead'

const V4V5ProjectProviders = dynamic(
  () => import('packages/v4v5/views/V4V5ProjectDashboard/V4V5ProjectProviders'),
  { ssr: false },
)
const V4V5ProjectDashboard = dynamic(
  () => import('packages/v4v5/views/V4V5ProjectDashboard/V4V5ProjectDashboard'),
  { ssr: false },
)

export const getStaticPaths: GetStaticPaths = async () => {
  // TODO: static paths is convoluted with chains, needs some thought
  // if (process.env.BUILD_CACHE_V5_PROJECTS === 'true') {
  //   const projects = await paginateDepleteProjectsQueryCall({
  //     variables: { where: { pv: PV_V5 } },
  //   })
  //   const paths = projects.map(({ projectId }) => ({
  //     params: { projectId: String(projectId) },
  //   }))
  //   return { paths, fallback: true }
  // }

  // TODO: We are switching to blocking as blocking fallback as its just not
  // working. Need to investigate further
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps<
  ProjectPageProps & { i18n: unknown; seoProps?: SEOHeadProps }
> = async context => {
  const locale = context.locale as string
  const messages = await loadCatalog(locale)
  const i18n = { locale, messages }

  if (!context.params) throw new Error('params not supplied')

  const { projectId, chainId } = jbUrn(context.params.jbUrn as string) ?? {}

  const props = (await getProjectStaticProps(
    Number(projectId),
    PV_V5,
    chainId,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  )) as any
  if (props?.props) {
    props.props.i18n = i18n

    // Generate SEO props for _app.tsx to render
    if (props.props.metadata && chainId && projectId) {
      const urn = toJbUrn(chainId, BigInt(projectId))
      const metadata = props.props.metadata
      const projectImage = metadata?.logoUri
        ? ipfsPublicGatewayUrl(cidFromUrl(metadata.logoUri))
        : undefined
      const description = metadata?.projectTagline
        ? metadata.projectTagline
        : metadata?.description
        ? stripHtmlTags(metadata.description)
        : undefined

      props.props.seoProps = {
        title: metadata?.name,
        url: `${SiteBaseUrl}v5/${urn}`,
        twitterCard: 'summary_large_image' as const,
        ...(description && { description }),
        ...(projectImage && { image: projectImage }),
        ...(metadata?.twitter && { twitterCreator: metadata.twitter }),
      }
    }
  }

  return {
    ...props,
    revalidate: 10, // 10 seconds https://nextjs.org/docs/api-reference/data-fetching/get-static-props#revalidate
  }
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

  if (!featureFlagEnabled(FEATURE_FLAGS.V5)) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        Too early sir. Please come back later. 🫡
      </div>
    )
  }

  return <>{children}</>
}

export default function V5ProjectPage({
  metadata,
  projectId,
  chainId,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  if (!chainId || !projectId) {
    return <div>Invalid URL</div>
  }

  return (
    <_Wrapper>
      <V4V5VersionProvider chainId={chainId} projectId={projectId}>
        <V4V5ProjectProviders chainId={chainId} projectId={BigInt(projectId)}>
          <V4V5ProjectDashboard />
        </V4V5ProjectProviders>
      </V4V5VersionProvider>
    </_Wrapper>
  )
}
