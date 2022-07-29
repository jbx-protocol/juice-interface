import {
  ProjectsDocument,
  ProjectsQuery,
  QueryProjectsArgs,
} from 'generated/graphql'

import client from './client'

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
  const first = variables.first ?? 1000
  const skip = variables.skip

  const { data } = await client.query<ProjectsQuery, QueryProjectsArgs>({
    query: ProjectsDocument,
    variables: { ...variables, first, skip },
  })
  let projects = data.projects

  if (projects.length) {
    const _projects = await paginateDepleteProjectsQueryCall({
      variables: {
        ...variables,
        first,
        skip: first + (skip ?? 0),
      },
    })
    projects = projects.concat(_projects)
  }

  return projects
}
