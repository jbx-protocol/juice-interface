import { AppWrapper } from 'components/common/CoreAppWrapper/CoreAppWrapper'
import { FEATURE_FLAGS } from 'constants/featureFlags'
import { OPEN_IPFS_GATEWAY_HOSTNAME } from 'constants/ipfs'
import { JBChainId, JBProjectProvider } from 'juice-sdk-react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { ReduxProjectCartProvider } from 'packages/v4/components/ProjectDashboard/ReduxProjectCartProvider'
import store from 'packages/v4/components/ProjectDashboard/redux/store'
import V4ProjectMetadataProvider from 'packages/v4/contexts/V4ProjectMetadataProvider'
import { chainNameMap } from 'packages/v4/utils/networks'
import { wagmiConfig } from 'packages/v4/wagmiConfig'
import React, { PropsWithChildren } from 'react'
import { Provider } from 'react-redux'
import { featureFlagEnabled } from 'utils/featureFlags'
import { WagmiProvider } from 'wagmi'
const V4ProjectDashboard = dynamic(
  () =>
    import('packages/v4/views/V4ProjectDashboard/V4ProjectDashboard').then(
      m => m.V4ProjectDashboard,
    ),
  { ssr: false },
)

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
          projectId={projectId}
          ctxProps={{
            metadata: { ipfsGatewayHostname: OPEN_IPFS_GATEWAY_HOSTNAME },
          }}
        >
          <V4ProjectMetadataProvider projectId={projectId}>
            <Provider store={store}>
              <ReduxProjectCartProvider>{children}</ReduxProjectCartProvider>
            </Provider>
          </V4ProjectMetadataProvider>
        </JBProjectProvider>
      </WagmiProvider>
    </AppWrapper>
  )
}
