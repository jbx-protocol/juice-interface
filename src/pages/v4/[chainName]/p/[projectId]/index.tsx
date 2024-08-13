import { AppWrapper } from 'components/common/CoreAppWrapper/CoreAppWrapper'
import { FEATURE_FLAGS } from 'constants/featureFlags'
import { OPEN_IPFS_GATEWAY_HOSTNAME } from 'constants/ipfs'
import { JBChainId, JBProjectProvider } from 'juice-sdk-react'
import { loadCatalog } from 'locales/utils'
import { GetStaticPaths, GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import { ReduxProjectCartProvider } from 'packages/v4/components/ProjectDashboard/ReduxProjectCartProvider'
import store from 'packages/v4/components/ProjectDashboard/redux/store'
import V4ProjectMetadataProvider from 'packages/v4/contexts/V4ProjectMetadataProvider'
import { chainNameMap } from 'packages/v4/utils/networks'
import { V4ProjectDashboard } from 'packages/v4/views/V4ProjectDashboard/V4ProjectDashboard'
import { wagmiConfig } from 'packages/v4/wagmiConfig'
import React, { PropsWithChildren } from 'react'
import { Provider } from 'react-redux'
import { featureFlagEnabled } from 'utils/featureFlags'
import { WagmiProvider } from 'wagmi'

// This is a hack to avoid SSR for now. At the moment when this is not applied to this page, you will see a rehydration error.
const _Wrapper: React.FC<PropsWithChildren> = ({ children }) => {
  const [hasMounted, setHasMounted] = React.useState(false)
  React.useEffect(() => {
    setHasMounted(true)
  }, [])

  if (!hasMounted) {
    return null
  }

  if (!featureFlagEnabled(FEATURE_FLAGS.V4)) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        Too early sir. Please come back later. 🫡
      </div>
    )
  }

  return <>{children}</>
}

export const getStaticPaths: GetStaticPaths = async () => {
  // if (process.env.BUILD_CACHE_V2_PROJECTS === 'true') {
  //   const projects = await paginateDepleteProjectsQueryCall({
  //     variables: { where: { pv: PV_V2 } },
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

export const getStaticProps: GetStaticProps<{
  i18n: unknown
}> = async context => {
  const locale = context.locale as string
  const messages = await loadCatalog(locale)
  const i18n = { locale, messages }

  if (!context.params) throw new Error('params not supplied')

  const projectId = parseInt(context.params.projectId as string)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // const props = (await getProjectStaticProps(projectId)) as any
  const props = {
    props: {
      i18n,
    },
  }

  return {
    ...props,
    revalidate: 10, // 10 seconds https://nextjs.org/docs/api-reference/data-fetching/get-static-props#revalidate
  }
}

export default function V4ProjectPage() {
  const router = useRouter()
  const { chainName, projectId } = router.query
  if (!chainName || !projectId) {
    return <div>Invalid URL</div>
  }
  const chainId = chainNameMap[chainName as string]

  return (
    <_Wrapper>
      <Providers chainId={chainId} projectId={BigInt(projectId as string)}>
        <V4ProjectDashboard />
      </Providers>
    </_Wrapper>
  )
}

const Providers: React.FC<
  PropsWithChildren & { chainId: JBChainId; projectId: bigint }
> = ({ chainId, projectId, children }) => {
  return (
    <AppWrapper txHistoryProvider="wagmi">
      <WagmiProvider config={wagmiConfig}>
        <JBProjectProvider
          chainId={chainId}
          projectId={BigInt(projectId)}
          ctxProps={{
            metadata: { ipfsGatewayHostname: OPEN_IPFS_GATEWAY_HOSTNAME },
          }}
        >
          <V4ProjectMetadataProvider projectId={BigInt(projectId)}>
            <Provider store={store}>
              <ReduxProjectCartProvider>{children}</ReduxProjectCartProvider>
            </Provider>
          </V4ProjectMetadataProvider>
        </JBProjectProvider>
      </WagmiProvider>
    </AppWrapper>
  )
}
