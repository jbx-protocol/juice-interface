import { isBrowser } from 'utils/isBrowser'

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

export const v4SubgraphUri = () => {
  const mainnetUrl = process.env.NEXT_PUBLIC_BENDYSTRAW_URL as string
  const testnetUrl = process.env.NEXT_PUBLIC_BENDYSTRAW_TESTNET_URL as string

  const uri =
    process.env.NEXT_PUBLIC_TESTNET === 'true' ? testnetUrl : mainnetUrl

  const url = new URL(uri)

  return url.href
}
