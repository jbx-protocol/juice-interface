import {
  ProjectsDocument,
  ProjectsQuery,
  QueryProjectsArgs,
} from 'generated/graphql'

import { paginateDepleteQuery } from './paginateDepleteQuery'
import { serverClient } from './serverClient'

/**
 * Loads all pages for the query.
 * @param variables Variables to apply to query.
 * @returns
 */
export async function paginateDepleteProjectsQueryCall({
  variables,
}: {
  variables: QueryProjectsArgs
}) {
  return paginateDepleteQuery<ProjectsQuery, QueryProjectsArgs>({
    client: serverClient,
    document: ProjectsDocument,
    variables,
  })
}
