import { Json } from 'models/json'
import { SepanaProject, SepanaQueryResponse } from 'models/sepana'

import { SEPANA_ENDPOINTS } from './endpoints'
import { sepanaAxios } from './http'

/**
 * Exhaustively queries all Sepana records.
 *
 * @returns Promise containing all records from Sepana database
 */
export async function queryAll<T extends object>() {
  return sepanaAxios('read').post<SepanaQueryResponse<T>>(
    SEPANA_ENDPOINTS.search,
    {
      engine_ids: [process.env.SEPANA_ENGINE_ID],
      query: {
        match_all: {},
      },
      size: 10000, // TODO: Update this before we hit 10k projects
      page: 0,
    },
  )
}

/**
 * Gets a single Sepana record with matching `_id`
 *
 * @param id ID to match
 * @returns Promise containing single record from Sepana database matching params
 */
export async function getRecord<T extends object>(id: string) {
  return sepanaAxios('read')
    .post<SepanaQueryResponse<T>>(SEPANA_ENDPOINTS.search, {
      engine_ids: [process.env.SEPANA_ENGINE_ID],
      query: {
        function_score: {
          query: {
            query_string: {
              query: `${id}`,
              fields: ['_id'],
            },
          },
        },
      },
      size: 1,
    })
    .then(res => res.data.hits.hits[0]?._source)
}

/**
 * Writes records to Sepana engine in groups of 500.
 *
 * @param records Projects to write to Sepana database
 */
export async function writeSepanaRecords(records: Json<SepanaProject>[]) {
  const jobs: string[] = []
  const errors: (string | object)[] = []
  const written: Json<SepanaProject>[] = []

  // Clone array because we mutate it
  const pageSize = 500
  let page = 0

  while (records.length > pageSize * page) {
    const queue = records.slice(pageSize * page, pageSize * (page + 1))

    await sepanaAxios('read/write')
      .post<{ job_id: string }>(SEPANA_ENDPOINTS.insert, {
        engine_id: process.env.SEPANA_ENGINE_ID,
        docs: queue,
      })
      .then(res => {
        jobs.push(res.data.job_id)
        written.push(...queue)
      })
      .catch(err => {
        errors.push(err)
      })

    page++
  }

  return { jobs, written, errors }
}
