import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
} from '@apollo/client'
import { BigNumber } from 'ethers'
import { isBigNumberish } from '@ethersproject/bignumber/lib/bignumber'
import { FunctionsMap, withScalars } from 'apollo-link-scalars'
import { IntrospectionQuery, buildClientSchema } from 'graphql'
import { isBrowser } from 'utils/isBrowser'
import introspectionResult from '../../../graphql.schema.json'

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

const typesMap: FunctionsMap = {
  BigInt: {
    serialize: (parsed: unknown): string | null => {
      return BigNumber.isBigNumber(parsed) ? parsed.toHexString() : null
    },
    parseValue: (raw: unknown): BigNumber | null => {
      if (raw === undefined || raw === null) return null

      if (isBigNumberish(raw)) return BigNumber.from(raw)

      throw new Error('Parse BigInt: Invalid BigNumber')
    },
  },
}

const schema = buildClientSchema(
  introspectionResult as unknown as IntrospectionQuery,
)

const scalarsLink = withScalars({ schema, typesMap })
const httpLink = new HttpLink({ uri: subgraphUri() })

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: ApolloLink.from([scalarsLink, httpLink]),
})

export default client
