import {
  ProjectsDocument,
  ProjectsQuery,
  QueryProjectsArgs,
} from 'generated/graphql'

import { paginateDepleteQuery } from './paginateDepleteQuery'

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
  return paginateDepleteQuery<
    ProjectsQuery,
    QueryProjectsArgs,
    ProjectsQuery['projects'][0]
  >({
    document: ProjectsDocument,
    variables,
  })
}
