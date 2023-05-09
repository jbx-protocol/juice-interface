import { ApolloClient, InMemoryCache } from '@apollo/client'

import { subgraphUri } from './subgraphUri'

const serverClient = new ApolloClient({
  uri: subgraphUri(),
  cache: new InMemoryCache(),
})

export { serverClient }
