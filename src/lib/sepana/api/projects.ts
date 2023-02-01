import { Json } from 'models/json'
import { SepanaProject, SepanaQueryResponse } from 'models/sepana'

import { SEPANA_ENDPOINTS } from './endpoints'
import { sepanaAxios } from './http'

/**
 * Search all Sepana project records, using preconfigured elastic search field weights and script source.
 *
 * @param query text to search
 * @param pageSize max number of results to return
 * @returns Promise containing project docs from Sepana database matching search params. If no query text is supplied, returns all projects
 */
export async function searchSepanaProjects(query = '', pageSize?: number) {
  return sepanaAxios('read')
    .post<SepanaQueryResponse<Json<SepanaProject>>>(SEPANA_ENDPOINTS.search, {
      engine_ids: [process.env.SEPANA_ENGINE_ID],
      query: {
        function_score: {
          query: {
            query_string: {
              query: `*${query}*`,
              // Match against name, handle, description
              // Weight matches to name and handle higher than description
              fields: ['name^2', 'handle^2', 'description'],
            },
          },
          script_score: {
            script: {
              source:
                // Prioritize matches with higher totalPaid and trendingScore
                "3 * Math.max(0, doc['totalPaid.keyword'].value.length() - 17) + 3 * Math.max(0, doc['trendingScore.keyword'].value.length() - 18)",
            },
          },
          boost_mode: 'sum',
        },
      },
      size: pageSize, // sepana uses default 20
      page: 0,
    })
    .then(res => res.data)
}
