import { ApolloClient, InMemoryCache } from '@apollo/client'

const subgraphUri = () => {
  const _subgraphUrl = process.env.GRAPHQL_SCHEMA_SUBGRAPH_URL
  if (!_subgraphUrl) {
    throw new Error('NEXT_PUBLIC_SUBGRAPH_URL not defined')
  }
  const url = new URL(_subgraphUrl)
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
