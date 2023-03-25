import { Json } from 'models/json'
import {
  SepanaProject,
  SepanaProjectQueryOpts,
  SepanaQueryResponse,
} from 'models/sepana'
import { SEPANA_DEFAULT_SCORE_SCRIPT } from '../constants'

import { SEPANA_ENDPOINTS } from './endpoints'
import { sepanaAxios } from './http'

export async function querySepanaProjects(opts: SepanaProjectQueryOpts) {
  const filter: Record<string, object>[] = []
  const must: Record<string, object>[] = []
  const must_not: Record<string, object>[] = []
  const sort: Record<string, object>[] = []

  if (opts.text) {
    must.push({
      query_string: {
        query: `*${opts.text}*`,
        // Match against name, handle, description
        // Weight matches to name and handle higher than description due to relevance
        fields: ['name^2', 'handle^2', 'description'],
      },
    })
  }

  if (opts.tags) {
    filter.push({
      terms: {
        tags: opts.tags,
      },
    })
  }

  if (opts.pv) {
    filter.push({
      terms: {
        pv: opts.pv,
      },
    })
  }

  if (opts.archived) {
    filter.push({
      term: {
        archived: 'true',
      },
    })
  } else {
    must_not.push({
      query_string: {
        query: 'archived:true',
      },
    })
  }

  if (opts.orderBy) {
    sort.push({
      [opts.orderBy]: {
        order: opts.orderDirection ?? 'asc',
      },
    })
  }

  const bool = {
    ...(filter.length ? { filter } : {}),
    ...(must.length ? { must } : {}),
    ...(must_not.length ? { must_not } : {}),
  }

  // Use function_score if sort isn't defined
  const query = sort.length
    ? {
        bool,
      }
    : {
        function_score: {
          query: { bool },
          script_score: { script: { source: SEPANA_DEFAULT_SCORE_SCRIPT } },
          boost_mode: 'sum',
        },
      }

  return sepanaAxios('read')
    .post<SepanaQueryResponse<Json<SepanaProject>>>(SEPANA_ENDPOINTS.search, {
      engine_ids: [process.env.SEPANA_ENGINE_ID],
      query,
      ...(sort.length ? { sort } : {}),
      size: opts.pageSize, // sepana uses default 20
      page: opts.page,
    })
    .then(res => res.data)
}
