import { OPEN_IPFS_GATEWAY_HOSTNAME } from 'constants/ipfs'
import ReactQueryProvider from 'contexts/ReactQueryProvider'
import { JBChainId, JBProjectProvider } from 'juice-sdk-react'
import { useRouter } from 'next/router'
import { wagmiConfig } from 'pages/v4/wagmiConfig'
import React, { PropsWithChildren } from 'react'
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
        <div>
          Hello {chainName} {projectId}
        </div>
      </Providers>
    </_Wrapper>
  )
}

const Providers: React.FC<
  PropsWithChildren & { chainId: JBChainId; projectId: bigint }
> = ({ chainId, projectId, children }) => {
  return (
    <ReactQueryProvider>
      <WagmiProvider config={wagmiConfig}>
        <JBProjectProvider
          chainId={chainId}
          projectId={BigInt(projectId)}
          ctxProps={{
            metadata: { ipfsGatewayHostname: OPEN_IPFS_GATEWAY_HOSTNAME },
          }}
        >
          {children}
        </JBProjectProvider>
      </WagmiProvider>
    </ReactQueryProvider>
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
