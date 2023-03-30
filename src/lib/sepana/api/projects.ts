import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { SBProjectQueryOpts } from 'models/supabaseProject'
import { NextApiRequest, NextApiResponse } from 'next'
import { Database } from 'types/database.types'

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
