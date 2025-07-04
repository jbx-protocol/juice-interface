import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { V2_BLOCKLISTED_PROJECTS } from 'constants/blocklist'
import { PV_V4 } from 'constants/pv'
import {
  DbProjectsDocument,
  DbProjectsQuery,
  Project,
  QueryProjectsArgs,
} from 'generated/graphql'

import { ApolloClient, InMemoryCache } from '@apollo/client'
import { readNetwork } from 'constants/networks'
import { bendystrawUri } from 'lib/apollo/bendystrawUri'
import { paginateDepleteBendystrawQuery } from 'lib/apollo/paginateDepleteBendystrawQuery'
import { paginateDepleteQuery } from 'lib/apollo/paginateDepleteQuery'
import { serverClient } from 'lib/apollo/serverClient'
import { DBProject, DBProjectQueryOpts, SGSBCompareKey } from 'models/dbProject'
import { Json } from 'models/json'
import { NextApiRequest, NextApiResponse } from 'next'
import {
  Dbv4ProjectsDocument,
  Dbv4ProjectsQuery,
  Dbv4ProjectsQueryVariables,
} from 'packages/v4/graphql/client/graphql'
import { Database } from 'types/database.types'
import { isHardArchived } from 'utils/archived'
import { getSubgraphIdForProject } from 'utils/graph'
import {
  formatDBProjectRow,
  formatSGProjectForDB,
  parseDBProjectsRow,
} from 'utils/sgDbProjects'
import { dbProjects } from '../clients'

/**
 * Query all projects from subgraph using apollo serverClient which is safe to use in edge runtime.
 */
export async function queryAllSGProjectsForServer() {
  const [v1v2v3, v4] = await Promise.all([
    paginateDepleteQuery<DbProjectsQuery, QueryProjectsArgs>({
      client: serverClient,
      document: DbProjectsDocument,
    }),
    ...(process.env.NEXT_PUBLIC_V4_ENABLED === 'true'
      ? [
          paginateDepleteBendystrawQuery<
            Dbv4ProjectsQuery,
            Dbv4ProjectsQueryVariables
          >({
            client: new ApolloClient({
              uri: `${bendystrawUri()}/graphql`,
              cache: new InMemoryCache(),
            }),
            document: Dbv4ProjectsDocument,
          }),
        ]
      : []),
  ])

  // Response must be retyped with Json<>, because the serverClient does not perform the parsing expected by generated types
  const v1v2v3WithChainId = v1v2v3.map(p => {
    return {
      ...p,
      chainId: readNetwork.chainId,
    }
  }) as unknown as Json<
    Pick<Project & { chainId: number; suckerGroupId: string }, SGSBCompareKey>
  >[]
  let v4Parsed = process.env.NEXT_PUBLIC_V4_ENABLED
    ? (v4.map(p => {
        return {
          ...p,
          id: getSubgraphIdForProject(PV_V4, p.projectId) + `_${p.chainId}`, // Patch in the subgraph ID for V4 projects (to be consitent with legacy subgraph)
          currentBalance: p.balance, // currentBalance renamed -> balance in bendystraw
          pv: PV_V4, // Patch in the PV for V4 projects,
        }
      }) as unknown as Json<
        Pick<
          Project & { chainId: number; suckerGroupId: string },
          SGSBCompareKey
        >
      >[])
    : []

  return [...v1v2v3WithChainId, ...v4Parsed].map(formatSGProjectForDB)
}

/**
 * Exhaustively queries all database projects.
 *
 * @returns Promise containing all projects from database
 */
export function dbpQueryAll() {
  return dbProjects.select('*').then(
    res => ({ data: res.data?.map(parseDBProjectsRow), error: undefined }),
    error => ({ data: [] as Json<DBProject>[], error }),
  )
}

/**
 * Writes records to database
 *
 * @param records Projects to write
 */
export async function writeDBProjects(
  records: Json<Omit<DBProject, '_updatedAt'>>[],
) {
  // Sanity check that all IDs are defined
  const missingIds = records.filter(r => r.id === undefined || r.id === null)

  if (missingIds.length) {
    throw new Error(
      `${missingIds.length} records are missing an id: ${missingIds
        .map(p => JSON.stringify(p))
        .join(', ')}`,
    )
  }

  const _updated_at = Date.now()

  const queue = records.map(r => ({
    ...formatDBProjectRow(r),
    archived: r.archived || isHardArchived(r), // store a project's hard archived state in the db
    _updated_at,
  }))

  return dbProjects.upsert(queue).select()
}

/**
 * Queries the projects table in the database, using search, sort, and filter options.
 * @param req Next API request
 * @param res Next API response
 * @param opts Search, sort, and filter options
 * @returns Raw SQL query response
 */
export async function queryDBProjectsAggregates(
  req: NextApiRequest,
  res: NextApiResponse,
  opts: DBProjectQueryOpts,
) {
  const orderBy = opts.orderBy ?? 'volume'
  const page = opts.page ?? 0
  const pageSize = opts.pageSize ?? 20
  // Only sort ascending if orderBy is defined and orderDirection is 'asc'
  const ascending = opts.orderBy ? opts.orderDirection === 'asc' : false
  const searchFilter = createSearchFilter(opts.text)

  const supabase = createServerSupabaseClient<Database>({ req, res })

  let query = supabase
    .from('projects_aggregate')
    .select('*')
    .order(orderBy, { ascending })
    .range(page * pageSize, (page + 1) * pageSize - 1)

  // Filter out blocklisted projects
  query = query.not('id', 'in', `(${V2_BLOCKLISTED_PROJECTS.join(',')})`)

  if (opts.archived) query = query.is('archived', true)
  else query = query.not('archived', 'is', true)
  if (opts.pv?.length) query = query.in('pv', opts.pv)
  if (opts.owner) query = query.ilike('owner', opts.owner)
  if (opts.creator) query = query.ilike('creator', opts.creator)
  if (opts.chainIds) query = query.in('chain_ids', opts.chainIds)
  if (opts.ids) query = query.in('id', opts.ids)
  if (opts.tags?.length) query = query.overlaps('tags', opts.tags)
  if (searchFilter) query = query.or(searchFilter)

  return query
}

/**
 * Creates a search filter for the database query.
 * @param searchText Search text to filter by (name, handle, or project_id).
 * @returns Search filter string
 */
const createSearchFilter = (searchText: string | undefined) => {
  if (!searchText) return undefined
  const name = `name.ilike.%${searchText}%`
  const handle = `handle.ilike.%${searchText}%`
  if (!isNaN(Number(searchText))) {
    const project_id = `project_id.eq.${searchText}`
    return `${name},${handle},${project_id}`
  }
  return `${name},${handle}`
}
