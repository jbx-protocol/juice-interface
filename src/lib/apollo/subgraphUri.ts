import { isBrowser } from 'utils/isBrowser'
import {
  arbitrum,
  arbitrumSepolia,
  base,
  baseSepolia,
  mainnet,
  optimism,
  optimismSepolia,
  sepolia,
} from 'viem/chains'

export const subgraphUri = () => {
  let uri: string | undefined
  if (isBrowser()) {
    uri = process.env.NEXT_PUBLIC_SUBGRAPH_URL
    if (!uri) {
      throw new Error(
        'NEXT_PUBLIC_SUBGRAPH_URL environment variable not defined',
      )
    }
  } else {
    uri = process.env.SUBGRAPH_URL
    if (!uri) {
      throw new Error('SUBGRAPH_URL environment variable not defined')
    }
  }

  const url = new URL(uri)
  if (url.pathname.match(/graphql$/g)) {
    return url.href.slice(0, url.href.lastIndexOf('/'))
  }

  return url.href
}

export const v4SubgraphUri = (chainId: number) => {
  let uri: string | undefined

  const env = {
    [mainnet.id]: {
      browserUrl: process.env.NEXT_PUBLIC_V4_ETHEREUM_SUBGRAPH_URL,
      serverUrl: process.env.V4_ETHEREUM_SUBGRAPH_URL,
    },
    [optimism.id]: {
      browserUrl: process.env.NEXT_PUBLIC_V4_OPTIMISM_SUBGRAPH_URL,
      serverUrl: process.env.V4_OPTIMISM_SUBGRAPH_URL,
    },
    [base.id]: {
      browserUrl: process.env.NEXT_PUBLIC_V4_BASE_SUBGRAPH_URL,
      serverUrl: process.env.V4_BASE_SUBGRAPH_URL,
    },
    [arbitrum.id]: {
      browserUrl: process.env.NEXT_PUBLIC_V4_ARBITRUM_SUBGRAPH_URL,
      serverUrl: process.env.V4_ARBITRUM_SUBGRAPH_URL,
    },

    // Test nets
    [sepolia.id]: {
      browserUrl: process.env.NEXT_PUBLIC_V4_SEPOLIA_SUBGRAPH_URL,
      serverUrl: process.env.V4_SEPOLIA_SUBGRAPH_URL,
    },
    [optimismSepolia.id]: {
      browserUrl: process.env.NEXT_PUBLIC_V4_OPTIMISM_SEPOLIA_SUBGRAPH_URL,
      serverUrl: process.env.V4_OPTIMISM_SEPOLIA_SUBGRAPH_URL,
    },
    [baseSepolia.id]: {
      browserUrl: process.env.NEXT_PUBLIC_V4_BASE_SEPOLIA_SUBGRAPH_URL,
      serverUrl: process.env.V4_BASE_SEPOLIA_SUBGRAPH_URL,
    },
    [arbitrumSepolia.id]: {
      browserUrl: process.env.NEXT_PUBLIC_V4_ARBITRUM_SEPOLIA_SUBGRAPH_URL,
      serverUrl: process.env.V4_ARBITRUM_SEPOLIA_SUBGRAPH_URL,
    },
  } as Record<number, { browserUrl?: string; serverUrl?: string }>

  if (isBrowser()) {
    uri = env?.[chainId]?.browserUrl
    if (!uri) {
      throw new Error('Public subgraph url for chain not defined: ' + chainId)
    }
  } else {
    uri = env?.[chainId]?.serverUrl
    if (!uri) {
      throw new Error('Subgraph url for chain not defined: ' + chainId)
    }
  }

  const url = new URL(uri)
  if (url.pathname.match(/graphql$/g)) {
    return url.href.slice(0, url.href.lastIndexOf('/'))
  }

  return url.href
}
