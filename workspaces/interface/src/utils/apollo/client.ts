import { ApolloClient, InMemoryCache } from '@apollo/client'
import { isBrowser } from 'utils/isBrowser'

const subgraphUri = () => {
  let uri: string | undefined
  if (isBrowser()) {
    uri = process.env.NEXT_PUBLIC_SUBGRAPH_URL
    if (!uri) {
      throw new Error(
        'NEXT_PUBLIC_SUBGRAPH_URL environment variable not defined',
      )
    }
  } else {
    uri = process.env.GRAPHQL_SCHEMA_SUBGRAPH_URL
    if (!uri) {
      throw new Error(
        'GRAPHQL_SCHEMA_SUBGRAPH_URL environment variable not defined',
      )
    }
  }

  const url = new URL(uri)
  if (url.pathname.match(/graphql$/g)) {
    return url.href.slice(0, url.href.lastIndexOf('/'))
  }
  return url.href
}

const client = new ApolloClient({
  uri: subgraphUri(),
  cache: new InMemoryCache(),
})

export default client
