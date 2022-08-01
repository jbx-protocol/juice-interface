import { ApolloClient, InMemoryCache } from '@apollo/client'
import { isBrowser } from 'utils/isBrowser'

const subgraphUri = () => {
  const urlKey = isBrowser()
    ? 'NEXT_PUBLIC_SUBGRAPH_URL'
    : 'GRAPHQL_SCHEMA_SUBGRAPH_URL'

  const uri = process.env[urlKey]
  if (!uri) {
    throw new Error(`${urlKey} environment variable not defined`)
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
