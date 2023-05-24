import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { DBProject, DBProjectQueryOpts } from 'models/dbProject'
import { Json } from 'models/json'
import { NextApiRequest, NextApiResponse } from 'next'
import { Database } from 'types/database.types'
import { formatDBProjectRow, parseDBProjectsRow } from 'utils/sgDbProjects'
import { dbProjects } from '../clients'

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
export async function writeDBProjects(records: Json<DBProject>[]) {
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
export async function queryDBProjects(
  req: NextApiRequest,
  res: NextApiResponse,
  opts: DBProjectQueryOpts,
) {
  const orderBy = opts.orderBy ?? 'total_paid'
  const page = opts.page ?? 0
  const pageSize = opts.pageSize ?? 20
  // Only sort ascending if orderBy is defined and orderDirection is 'asc'
  const ascending = opts.orderBy ? opts.orderDirection === 'asc' : false

  const searchFilter = createSearchFilter(opts.text)

  const supabase = createServerSupabaseClient<Database>({ req, res }).from(
    'projects',
  )

  let query = supabase
    .select('*')
    .order('pv', { ascending: false })
    .order(orderBy, { ascending })
    .range(page * pageSize, (page + 1) * pageSize)

  if (opts.archived) query = query.is('archived', true)
  else query = query.not('archived', 'is', true)
  if (opts.pv?.length) query = query.in('pv', opts.pv)
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
