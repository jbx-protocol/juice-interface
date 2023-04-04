import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { DBProject, DBProjectQueryOpts } from 'models/dbProject'
import { Json } from 'models/json'
import { NextApiRequest, NextApiResponse } from 'next'
import { Database } from 'types/database.types'
import { dbProjects } from '../clients'

/**
 * Exhaustively queries all database projects.
 *
 * @returns Promise containing all projects from database
 */
export function dbpQueryAll() {
  return dbProjects.select('*').then(
    res => ({ data: res.data as Json<DBProject>[], error: undefined }),
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

  const _updatedAt = Date.now()

  const queue = records.map(r => ({
    ...r,
    _updatedAt,

    // hacky? fix to avoid undefined column vals
    name: r.name ?? null,
    description: r.description ?? null,
    logoUri: r.logoUri ?? null,
    metadataUri: r.metadataUri ?? null,
    tags: r.tags || [],
    archived: r.archived || false,
    _hasUnresolvedMetadata: r._hasUnresolvedMetadata ?? null,
    _metadataRetriesLeft: r._metadataRetriesLeft ?? null,
  }))

  return dbProjects.upsert(queue).select()
}

export async function queryDBProjects(
  req: NextApiRequest,
  res: NextApiResponse,
  opts: DBProjectQueryOpts,
) {
  const orderBy = opts.orderBy ?? 'totalPaid'
  const page = opts.page ?? 0
  const pageSize = opts.pageSize ?? 20
  // Only sort ascending if orderBy is defined and orderDirection is 'asc'
  const ascending = opts.orderBy ? opts.orderDirection === 'asc' : false

  const searchText = opts.text ? `*${opts.text}*` : undefined

  const searchFilter = searchText
    ? `name.fts.${searchText},handle.fts.${searchText},description.fts.${searchText}`
    : undefined

  const supabase = createServerSupabaseClient<Database>({ req, res }).from(
    'projects',
  )

  let query = supabase
    .select()
    .is('archived', opts.archived ?? false)
    .order(orderBy, { ascending })
    .range(page * pageSize, (page + 1) * pageSize)

  if (opts.pv?.length) query = query.in('pv', opts.pv)
  if (opts.tags?.length) query = query.overlaps('tags', opts.tags)
  if (searchFilter) query = query.or(searchFilter)

  return query
}
