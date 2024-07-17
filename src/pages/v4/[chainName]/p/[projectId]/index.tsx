import { AppWrapper } from 'components/common/CoreAppWrapper/CoreAppWrapper'
import { FEATURE_FLAGS } from 'constants/featureFlags'
import { OPEN_IPFS_GATEWAY_HOSTNAME } from 'constants/ipfs'
import { JBChainId, JBProjectProvider } from 'juice-sdk-react'
import { useRouter } from 'next/router'
import V4ProjectMetadataProvider from 'packages/v4/contexts/V4ProjectMetadataProvider'
import { V4ProjectDashboard } from 'packages/v4/views/V4ProjectDashboard/V4ProjectDashboard'
import { wagmiConfig } from 'packages/v4/wagmiConfig'
import React, { PropsWithChildren } from 'react'
import { featureFlagEnabled } from 'utils/featureFlags'
import {
  arbitrumSepolia,
  baseSepolia,
  optimismSepolia,
  sepolia,
} from 'viem/chains'
import { WagmiProvider } from 'wagmi'

const chainNameMap: Record<string, JBChainId> = {
  sepolia: sepolia.id,
  opsepolia: optimismSepolia.id,
  basesepolia: baseSepolia.id,
  arbsepolia: arbitrumSepolia.id,
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
            {children}
          </V4ProjectMetadataProvider>
        </JBProjectProvider>
      </WagmiProvider>
    </AppWrapper>
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

  if (!featureFlagEnabled(FEATURE_FLAGS.V4)) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        Too early sir. Please come back later. 🫡
      </div>
    )
  }

  return <>{children}</>
}
