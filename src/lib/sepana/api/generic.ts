import { projectsBucket } from 'lib/api/supabase'
import { Json } from 'models/json'
import { SBProject } from 'models/supabaseProject'
import { CURRENT_VERSION } from '../constants'

/**
 * Exhaustively queries all Sepana records.
 *
 * @returns Promise containing all records from Sepana database
 */
export function sbpQueryAll() {
  return projectsBucket.select('*').then(
    res => ({ data: res.data as Json<SBProject>[], error: undefined }),
    error => ({ data: [] as Json<SBProject>[], error }),
  )
}

/**
 * Writes records to Sepana engine in groups of 500.
 *
 * @param records Projects to write to Sepana database
 */
export async function writeSBProjects(records: Json<SBProject>[]) {
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

  return projectsBucket.upsert(queue).select()
}
