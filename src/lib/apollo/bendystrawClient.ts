import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject,
} from '@apollo/client';
import { FunctionsMap, withScalars } from 'apollo-link-scalars';
import { IntrospectionQuery, buildClientSchema } from 'graphql';
import { bendystrawUri } from 'lib/apollo/bendystrawUri';
import introspectionResult from '../../packages/v4v5/graphql/graphql.schema.json';
(BigInt.prototype as unknown as { toJSON: unknown }).toJSON = function () {
  return this.toString()
}

function merge(
  existing: { pageInfo?: { endCursor?: string }; items: [] } | undefined,
  incoming: { pageInfo?: { endCursor?: string }; items: [] },
) {
  return {
    ...existing,
    ...incoming,
    pageInfo: {
      ...(existing?.pageInfo ?? {}),
      ...(incoming.pageInfo ?? {}),
    },
    items:
      incoming.pageInfo &&
      existing?.pageInfo &&
      incoming.pageInfo.endCursor === existing.pageInfo.endCursor // crude prevent double query
        ? incoming.items
        : [...(existing?.items || []), ...(incoming.items || [])],
  }
}

const cacheConfig = {
  typePolicies: {
    Query: {
      fields: {
        activityEvents: {
          keyArgs: ['where', 'orderBy', 'orderDirection'],
          merge,
        },
      },
    },
  },
} as const

const schema = buildClientSchema(
  introspectionResult as unknown as IntrospectionQuery,
)

const typesMap: FunctionsMap = {
  BigInt: {
    serialize: (parsed: unknown): string | null => {
      // convert bigints to strings
      return parsed !== null ? (parsed as bigint).toString() : null
    },
    parseValue: (raw: unknown): bigint | null => {
      // convert bigint-typed strings to bigints
      if (raw === undefined || raw === null) return null

      return BigInt(raw as string | number)
    },
  },
}

const scalarsLink = withScalars({ schema, typesMap })

const httpLink = new HttpLink({
  uri: `${bendystrawUri()}/graphql`,
})

// Mainnet client
const mainnetHttpLink = new HttpLink({
  uri: `${process.env.NEXT_PUBLIC_BENDYSTRAW_URL}/graphql`,
})

export const mainnetBendystrawClient = new ApolloClient({
  cache: new InMemoryCache(cacheConfig),
  link: ApolloLink.from([scalarsLink, mainnetHttpLink]),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
  },
})

// Testnet client
const testnetHttpLink = new HttpLink({
  uri: `${process.env.NEXT_PUBLIC_BENDYSTRAW_TESTNET_URL}/graphql`,
})

export const testnetBendystrawClient = new ApolloClient({
  cache: new InMemoryCache(cacheConfig),
  link: ApolloLink.from([scalarsLink, testnetHttpLink]),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
  },
})

// Legacy client (uses environment variable to determine which backend)
export const bendystrawClient = new ApolloClient({
  cache: new InMemoryCache(cacheConfig),
  link: ApolloLink.from([scalarsLink, httpLink]),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
  },
})

// Get the appropriate client based on chainId
export function getBendystrawClient(chainId?: number): ApolloClient<NormalizedCacheObject> {
  if (!chainId) {
    return bendystrawClient
  }

  // Testnet chain IDs: Sepolia (11155111), Optimism Sepolia (11155420), Base Sepolia (84532), Arbitrum Sepolia (421614)
  const testnetChainIds = [11155111, 11155420, 84532, 421614]
  const isTestnetChain = testnetChainIds.includes(chainId)

  return isTestnetChain ? testnetBendystrawClient : mainnetBendystrawClient
}
