import type { TExternalWallet } from '@getpara/react-common'
import type { Environment, TOAuthMethod } from '@getpara/react-sdk'
import ReactQueryProvider from 'contexts/ReactQueryProvider'
import dynamic from 'next/dynamic'
import { http } from 'wagmi'
import {
  arbitrum,
  arbitrumSepolia,
  base,
  baseSepolia,
  mainnet,
  optimism,
  optimismSepolia,
  sepolia,
} from 'wagmi/chains'

const APP_NAME = 'Juicebox'
const APP_LOGO_URL = 'https://juicebox.money/assets/juice-logo-full_black.svg'
const APP_DESCRIPTION =
  'Juicebox is a platform for building and funding projects with community support.'
const APP_URL = 'https://juicebox.money'

const OAUTH_METHODS: TOAuthMethod[] = [
  'GOOGLE',
  'TWITTER',
  'APPLE',
  'DISCORD',
  'TELEGRAM',
  'FACEBOOK',
]

const SUPPORTED_WALLETS: TExternalWallet[] = [
  'METAMASK',
  'COINBASE',
  'SAFE',
  'RABBY',
  'WALLETCONNECT',
  'ZERION',
]

const SUPPORTED_CHAINS = [
  mainnet,
  optimism,
  arbitrum,
  base,
  sepolia,
  optimismSepolia,
  baseSepolia,
  arbitrumSepolia,
] as const

const requiredEnvVars = {
  PARA_API_KEY: process.env.NEXT_PUBLIC_PARA_API_KEY,
  INFURA_ID: process.env.NEXT_PUBLIC_INFURA_ID,
  WALLET_CONNECT_PROJECT_ID: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,
} as const

const missingEnvVars = Object.entries(requiredEnvVars)
  .filter(([_, value]) => !value)
  .map(([key]) => `NEXT_PUBLIC_${key}`)

if (missingEnvVars.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missingEnvVars.join(', ')}`,
  )
}

const { PARA_API_KEY, INFURA_ID, WALLET_CONNECT_PROJECT_ID } = requiredEnvVars

const createInfuraTransport = (network: string) =>
  http(`https://${network}.infura.io/v3/${INFURA_ID}`)

const transports = {
  [mainnet.id]: createInfuraTransport('mainnet'),
  [optimism.id]: createInfuraTransport('optimism-mainnet'),
  [arbitrum.id]: createInfuraTransport('arbitrum-mainnet'),
  [base.id]: createInfuraTransport('base-mainnet'),
  [sepolia.id]: createInfuraTransport('sepolia'),
  [optimismSepolia.id]: createInfuraTransport('optimism-sepolia'),
  [baseSepolia.id]: createInfuraTransport('base-sepolia'),
  [arbitrumSepolia.id]: createInfuraTransport('arbitrum-sepolia'),
} as const

const ParaProvider = dynamic(
  async () => {
    const { ParaProvider } = await import('@getpara/react-sdk')
    return { default: ParaProvider }
  },
  {
    ssr: false,
    loading: () => null,
  },
)

const paraModalConfig = {
  disableEmailLogin: false,
  disablePhoneLogin: false,
  oAuthMethods: OAUTH_METHODS,
}

const appConfig = {
  appName: APP_NAME,
}

const externalWalletConfig = {
  appDescription: APP_DESCRIPTION,
  appIcon: APP_LOGO_URL,
  appUrl: APP_URL,
  evmConnector: {
    config: {
      chains: SUPPORTED_CHAINS,
      transports,
    },
    wagmiProviderProps: {},
  },
  wallets: SUPPORTED_WALLETS,
  walletConnect: {
    projectId: WALLET_CONNECT_PROJECT_ID!,
  },
}

export const ParaProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <ReactQueryProvider>
      <ParaProvider
        paraClientConfig={{
          env:
            (process.env.NEXT_PUBLIC_PARA_ENV as Environment) ||
            ('BETA' as Environment),
          apiKey: PARA_API_KEY!,
        }}
        config={appConfig}
        paraModalConfig={paraModalConfig}
        externalWalletConfig={externalWalletConfig}
      >
        {children}
      </ParaProvider>
    </ReactQueryProvider>
  )
}
