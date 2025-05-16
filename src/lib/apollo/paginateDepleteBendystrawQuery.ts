import { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import { InputMaybe } from 'generated/graphql'
import { DocumentNode } from 'graphql'

/**
 * Loads all pages for the query.
 * @param client ApolloClient to use for query.
 * @param document GraphQL docuemnt to define query.
 * @param variables Variables to apply to query.
 * @returns
 */
export async function paginateDepleteBendystrawQuery<
  Query extends {
    [k: string]: {
      items: T[]
      pageInfo: { hasNextPage: boolean | null; endCursor: string | null }
    }
  },
  QueryArgs extends {
    limit?: InputMaybe<number>
    after?: InputMaybe<string>
  },
  T = Query[keyof Query]['items'] extends Array<infer U> ? U : never,
>({
  client,
  document,
  variables,
}: {
  client: ApolloClient<NormalizedCacheObject>
  document: DocumentNode
  variables?: QueryArgs
}) {
  const limit = variables?.limit ?? 1000
  const after = variables?.after ?? null

  const { data } = await client.query<Query, QueryArgs>({
    query: document,
    variables: {
      ...(variables ?? {}),
      limit,
      after,
    } as QueryArgs,
  })

  // Parse the property in response that contains the queried entities
  const key = Object.keys(data).find(k => Array.isArray(data[k].items))

  if (!key) return []

  let records = data[key].items

  if (data[key].pageInfo.hasNextPage) {
    // page again if we get back a full list
    const _records = await paginateDepleteBendystrawQuery<Query, QueryArgs, T>({
      client,
      document,
      variables: {
        ...(variables ?? {}),
        limit,
        after: data[key].pageInfo.endCursor,
      } as QueryArgs,
    })

    records = records.concat(_records)
  }

  return records
}
