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
      return BigNumber.isBigNumber(parsed) ? parsed.toString() : null
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
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          projectEvents: {
            // Create a new cache list when the `where` variable changes. Otherwise apply the below `merge` function to any existing cached list, even if other variables change like `first` or `skip`. This strategy enables infinite paging for unique lists while still preventing cached data from being unexpectedly included in query results, especially when updating the `where` argument to filter events by Paid, Redeemed, etc.
            // https://www.apollographql.com/docs/react/pagination/key-args/
            keyArgs: ['where'],
            merge(existing = [], incoming) {
              // For a single list (even if `first` or `skip` arguments have changed) concatenate results of subsequent queries into the existing cache
              // https://www.apollographql.com/docs/react/pagination/core-api
              return [...existing, ...incoming]
            },
          },
        },
      },
    },
  }),
  link: ApolloLink.from([scalarsLink, httpLink]),
})

export { client }
