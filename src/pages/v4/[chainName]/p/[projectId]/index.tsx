import { V4ProjectSEO } from 'components/ProjectPageSEO'
import { AppWrapper } from 'components/common/CoreAppWrapper/CoreAppWrapper'
import { FEATURE_FLAGS } from 'constants/featureFlags'
import { OPEN_IPFS_GATEWAY_HOSTNAME } from 'constants/ipfs'
import { PV_V4 } from 'constants/pv'
import { JBChainId, JBProjectProvider } from 'juice-sdk-react'
import { loadCatalog } from 'locales/utils'
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next'
import { ReduxProjectCartProvider } from 'packages/v4/components/ProjectDashboard/ReduxProjectCartProvider'
import store from 'packages/v4/components/ProjectDashboard/redux/store'
import { V4NftRewardsProvider } from 'packages/v4/contexts/V4NftRewards/V4NftRewardsProvider'
import V4ProjectMetadataProvider from 'packages/v4/contexts/V4ProjectMetadataProvider'
import { V4UserNftCreditsProvider } from 'packages/v4/contexts/V4UserNftCreditsProvider'
import { V4UserTotalTokensBalanceProvider } from 'packages/v4/contexts/V4UserTotalTokensBalanceProvider'
import { chainNameMap } from 'packages/v4/utils/networks'
import { V4ProjectDashboard } from 'packages/v4/views/V4ProjectDashboard/V4ProjectDashboard'
import { wagmiConfig } from 'packages/v4/wagmiConfig'
import React, { PropsWithChildren } from 'react'
import { Provider } from 'react-redux'
import { featureFlagEnabled } from 'utils/featureFlags'
import {
  getProjectStaticProps,
  ProjectPageProps,
} from 'utils/server/pages/props'
import { WagmiProvider } from 'wagmi'

export const getStaticPaths: GetStaticPaths = async () => {
  // TODO: static paths is convoluted with chains, needs some thought
  // if (process.env.BUILD_CACHE_V4_PROJECTS === 'true') {
  //   const projects = await paginateDepleteProjectsQueryCall({
  //     variables: { where: { pv: PV_V4 } },
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
  ProjectPageProps & { i18n: unknown }
> = async context => {
  const locale = context.locale as string
  const messages = await loadCatalog(locale)
  const i18n = { locale, messages }

  if (!context.params) throw new Error('params not supplied')

  const projectId = parseInt(context.params.projectId as string)
  const chainName = context.params.chainName as string
  const props = (await getProjectStaticProps(
    projectId,
    PV_V4,
    chainName,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  )) as any
  if (props?.props) {
    props.props.i18n = i18n
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

  if (!featureFlagEnabled(FEATURE_FLAGS.V4)) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        Too early sir. Please come back later. 🫡
      </div>
    )
  }

  return <>{children}</>
}

export default function V4ProjectPage({
  metadata,
  projectId,
  chainName,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  if (!chainName || !projectId) {
    return <div>Invalid URL</div>
  }
  const chainId = chainNameMap[chainName]

  return (
    <>
      <V4ProjectSEO
        metadata={metadata}
        chainName={chainName}
        projectId={projectId}
      />
      <_Wrapper>
        <Providers chainId={chainId} projectId={BigInt(projectId)}>
          <V4ProjectDashboard />
        </Providers>
      </_Wrapper>
    </>
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
          projectId={projectId}
          ctxProps={{
            metadata: { ipfsGatewayHostname: OPEN_IPFS_GATEWAY_HOSTNAME },
          }}
        >
          <V4ProjectMetadataProvider projectId={projectId}>
            <Provider store={store}>
              <V4UserNftCreditsProvider>
                <V4UserTotalTokensBalanceProvider>
                  <V4NftRewardsProvider>
                    <ReduxProjectCartProvider>
                      {children}
                    </ReduxProjectCartProvider>
                  </V4NftRewardsProvider>
                </V4UserTotalTokensBalanceProvider>
              </V4UserNftCreditsProvider>
            </Provider>
          </V4ProjectMetadataProvider>
        </JBProjectProvider>
      </WagmiProvider>
    </AppWrapper>
  )
}
