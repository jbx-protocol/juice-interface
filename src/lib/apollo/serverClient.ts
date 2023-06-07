import { ApolloClient, InMemoryCache } from '@apollo/client'

import { subgraphUri } from './subgraphUri'

/**
 * Unlike `client`, `serverClient` is safe to use in the edge runtime. However this client does not perform parsing on the response, meaning returned objects may not match the auto-generated types.
 */
const serverClient = new ApolloClient({
  uri: subgraphUri(),
  cache: new InMemoryCache(),
})

export { serverClient }
