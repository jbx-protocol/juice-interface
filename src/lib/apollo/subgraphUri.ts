import { JBChainId } from 'juice-sdk-react'
import { isBrowser } from 'utils/isBrowser'
import { sepolia } from 'viem/chains'

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

export const v4SubgraphUri = (chainId: JBChainId) => {
  let uri: string | undefined

  const env: {
    [k in JBChainId]?: {
      browserUrl?: string
      serverUrl?: string
    }
  } = {
    [sepolia.id]: {
      browserUrl: process.env.NEXT_PUBLIC_V4_SEPOLIA_SUBGRAPH_URL,
      serverUrl: process.env.V4_SEPOLIA_SUBGRAPH_URL,
    },
  } as const

  if (isBrowser()) {
    uri = env?.[chainId]?.browserUrl
    if (!uri) {
      throw new Error(
        'NEXT_PUBLIC_V4_SUBGRAPH_URL environment variable not defined',
      )
    }
  } else {
    uri = env?.[chainId]?.serverUrl
    if (!uri) {
      throw new Error('V4_SUBGRAPH_URL environment variable not defined')
    }
  }

  const url = new URL(uri)
  if (url.pathname.match(/graphql$/g)) {
    return url.href.slice(0, url.href.lastIndexOf('/'))
  }

  return url.href
}
