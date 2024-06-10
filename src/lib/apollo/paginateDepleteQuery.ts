import { InputMaybe, fetcher } from 'generated/graphql'

/**
 * Loads all pages for the query.
 * @param document GraphQL docuemnt to define query.
 * @param variables Variables to apply to query.
 * @returns
 */
export async function paginateDepleteQuery<
  Query extends { [k: string]: T[] },
  QueryArgs extends
    | {
        first?: InputMaybe<number>
        skip?: InputMaybe<number>
      }
    | undefined = undefined,
  T = Query[keyof Query] extends Array<infer U> ? U : never,
>({ document, variables }: { document: string; variables?: QueryArgs }) {
  const first = variables?.first ?? 1000
  const skip = variables?.skip ?? 0

  const fetchQuery = fetcher<Query, QueryArgs>(document, {
    ...(variables ?? {}),
    first,
    skip,
  } as QueryArgs)

  const data = await fetchQuery()

  // Parse the property in response that contains the queried entities
  const key = Object.keys(data).find(k => Array.isArray(data[k]))

  if (!key) return []

  let records = data[key]

  if (data[key].length === first) {
    // page again if we get back a full list
    const _records = await paginateDepleteQuery<Query, QueryArgs, T>({
      document,
      variables: {
        ...(variables ?? {}),
        first,
        skip: first + skip,
      } as QueryArgs,
    })

    records = records.concat(_records)
  }

  return records
}
