import { Json } from 'models/json'
import { ProjectTag } from 'models/project-tags'
import { SepanaProject, SepanaQueryResponse } from 'models/sepana'
import { SEPANA_DEFAULT_SCORE_SCRIPT } from '../constants'

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
              source: SEPANA_DEFAULT_SCORE_SCRIPT,
            },
          },
          boost_mode: 'sum',
        },
      },
      size: pageSize, // sepana uses default 20
    })
    .then(res => res.data)
}

export async function searchSepanaProjectTags(
  tags: ProjectTag[],
  pageSize?: number,
) {
  return sepanaAxios('read')
    .post<SepanaQueryResponse<Json<SepanaProject>>>(SEPANA_ENDPOINTS.search, {
      engine_ids: [process.env.SEPANA_ENGINE_ID],
      query: {
        function_score: {
          query: {
            query_string: {
              query: tags.join(' '),
              fields: ['tags'],
              minimum_should_match: '100%',
            },
          },
          script_score: {
            script: {
              source: SEPANA_DEFAULT_SCORE_SCRIPT,
            },
          },
          boost_mode: 'sum',
        },
      },
      size: pageSize, // sepana uses default 20
    })
    .then(res => res.data)
}
