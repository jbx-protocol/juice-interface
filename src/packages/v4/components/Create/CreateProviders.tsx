import { wagmiConfig } from 'packages/v4/wagmiConfig'
import { WagmiProvider } from 'wagmi'

export default function CreateProviders({
  children,
}: {
  children: React.ReactNode
}) {
  return <WagmiProvider config={wagmiConfig}>{children}</WagmiProvider>
}
