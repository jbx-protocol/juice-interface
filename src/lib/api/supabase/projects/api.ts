import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { Json } from 'models/json'
import { SBProject, SBProjectQueryOpts } from 'models/supabaseProject'
import { NextApiRequest, NextApiResponse } from 'next'
import { Database } from 'types/database.types'
import { sbProjects } from '../clients'
import { CURRENT_VERSION } from './constants'

/**
 * Exhaustively queries all Supabase projects.
 *
 * @returns Promise containing all projects from Supabase database
 */
export function sbpQueryAll() {
  return sbProjects.select('*').then(
    res => ({ data: res.data as Json<SBProject>[], error: undefined }),
    error => ({ data: [] as Json<SBProject>[], error }),
  )
}

/**
 * Writes records to Supabase db
 *
 * @param records Projects to write
 */
export async function writeSBProjects(records: Json<SBProject>[]) {
  // Sanity check that all IDs are defined
  const missingIds = records.filter(r => r.id === undefined || r.id === null)

  if (missingIds.length) {
    throw new Error(
      `${missingIds.length} records are missing an id: ${missingIds
        .map(p => JSON.stringify(p))
        .join(', ')}`,
    )
  }

  const _lastUpdated = Date.now()

  const queue = records.map(r => ({
    ...r,
    _v: CURRENT_VERSION,
    _lastUpdated,

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

  return sbProjects.upsert(queue).select()
}

export async function querySBProjects(
  req: NextApiRequest,
  res: NextApiResponse,
  opts: SBProjectQueryOpts,
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
