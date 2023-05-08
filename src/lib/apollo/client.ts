import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
} from '@apollo/client'
import { FunctionsMap, withScalars } from 'apollo-link-scalars'
import { BigNumber } from 'ethers'
import { IntrospectionQuery, buildClientSchema } from 'graphql'
import { isBigNumberish } from 'utils/bigNumbers'
import introspectionResult from '../../../graphql.schema.json'
import { subgraphUri } from './subgraphUri'

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

export { client }
