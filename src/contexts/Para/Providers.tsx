import { createParaWagmiConfig } from '@getpara/evm-wallet-connectors'
import { type TExternalWallet } from '@getpara/react-common'
import ParaWeb, {
  ParaProvider,
  type Environment,
  type ParaModalProps,
  type TOAuthMethod,
} from '@getpara/react-sdk-lite'
import { ThemeOption } from 'constants/theme/themeOption'
import ReactQueryProvider from 'contexts/ReactQueryProvider'
import { ThemeContext } from 'contexts/Theme/ThemeContext'
import { useContext } from 'react'
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

const APP_CONFIG = {
  name: 'Juicebox',
  logoUrl: 'https://juicebox.money/assets/juice-logo-full_black.svg',
  description:
    'Juicebox is a platform for building and funding projects with community support.',
  url: 'https://juicebox.money',
}

const OAUTH_METHODS: TOAuthMethod[] = [
  'GOOGLE',
  'TWITTER',
  'APPLE',
  'DISCORD',
  'TELEGRAM',
  'FACEBOOK',
  'FARCASTER',
]

const SUPPORTED_WALLETS: TExternalWallet[] = [
  'METAMASK',
  'COINBASE',
  'SAFE',
  'WALLETCONNECT',
  'ZERION',
  'PHANTOM',
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
]

const requiredEnvVars = {
  PARA_API_KEY: process.env.NEXT_PUBLIC_PARA_API_KEY,
  INFURA_ID: process.env.NEXT_PUBLIC_INFURA_ID,
  WALLET_CONNECT_PROJECT_ID: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,
} as const

const missingEnvVars = Object.entries(requiredEnvVars)
  .filter(([_, value]) => !value)
  .map(([key]) => key)

if (missingEnvVars.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missingEnvVars.join(', ')}`,
  )
}

// Type narrowing: after the check above, we know these values are defined
const PARA_API_KEY = requiredEnvVars.PARA_API_KEY as string
const INFURA_ID = requiredEnvVars.INFURA_ID as string
const WALLET_CONNECT_PROJECT_ID =
  requiredEnvVars.WALLET_CONNECT_PROJECT_ID as string

const createInfuraTransport = (network: string) => {
  const url = `https://${network}.infura.io/v3/${INFURA_ID}`
  return http(url)
}

const transports = {
  [mainnet.id]: createInfuraTransport('mainnet'),
  [optimism.id]: createInfuraTransport('optimism-mainnet'),
  [arbitrum.id]: createInfuraTransport('arbitrum-mainnet'),
  [base.id]: createInfuraTransport('base-mainnet'),
  [sepolia.id]: createInfuraTransport('sepolia'),
  [optimismSepolia.id]: createInfuraTransport('optimism-sepolia'),
  [baseSepolia.id]: createInfuraTransport('base-sepolia'),
  [arbitrumSepolia.id]: createInfuraTransport('arbitrum-sepolia'),
}

const paraClient = new ParaWeb(
  (process.env.NEXT_PUBLIC_PARA_ENV as Environment) || 'BETA',
  PARA_API_KEY,
)

// create a wagmiConfig instance outside of the ParaProvider so its accessible globally
export const wagmiConfig = createParaWagmiConfig(paraClient, {
  //@ts-ignore Project has multiple dependencies all with different versions of wagmi/viem creating type conflicts.
  chains: SUPPORTED_CHAINS,
  transports: transports,
  wallets: SUPPORTED_WALLETS,
  ssr: true,
})

const paraModalConfig: (theme: ThemeOption) => ParaModalProps = (
  theme: ThemeOption,
) => ({
  disableEmailLogin: false,
  disablePhoneLogin: false,
  authLayout: ['AUTH:FULL', 'EXTERNAL:FULL'],
  oAuthMethods: OAUTH_METHODS,
  theme: {
    backgroundColor: theme === ThemeOption.light ? '#ffffff' : '#16141d',
    foregroundColor: '#5777eb',
    borderRadius: 'lg',
    mode: theme,
  },
})

const appConfig = {
  appName: APP_CONFIG.name,
}

const externalWalletConfig = {
  appDescription: APP_CONFIG.description,
  appIcon: APP_CONFIG.logoUrl,
  appUrl: APP_CONFIG.url,
  evmConnector: {
    config: {
      chains: SUPPORTED_CHAINS,
      transports: transports,
    },
  },
  wallets: SUPPORTED_WALLETS,
  walletConnect: {
    projectId: WALLET_CONNECT_PROJECT_ID,
  },
}

export const ParaProviders = ({ children }: { children: React.ReactNode }) => {
  const { themeOption } = useContext(ThemeContext)

  return (
    <ReactQueryProvider>
      <ParaProvider
        paraClientConfig={paraClient}
        config={appConfig}
        paraModalConfig={paraModalConfig(themeOption)}
        // @ts-ignore
        externalWalletConfig={externalWalletConfig}
      >
        {children}
      </ParaProvider>
    </ReactQueryProvider>
  )
}

export default ParaProviders
