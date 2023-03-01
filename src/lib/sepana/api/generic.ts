import { Json } from 'models/json'
import { SepanaProject, SepanaQueryResponse } from 'models/sepana'
import { CURRENT_VERSION } from '../constants'

import { SEPANA_ENDPOINTS } from './endpoints'
import { sepanaAxios } from './http'

const MAX_SEPANA_PAGE_SIZE = 100

/**
 * Exhaustively queries all Sepana records.
 *
 * @returns Promise containing all records from Sepana database
 */
export async function queryAll<T extends object>() {
  const hits: SepanaQueryResponse<T>['hits']['hits'] = []

  let total: number | undefined

  const query = async (page: number) => {
    const { data } = await sepanaAxios('read').post<SepanaQueryResponse<T>>(
      SEPANA_ENDPOINTS.search,
      {
        engine_ids: [process.env.SEPANA_ENGINE_ID],
        query: {
          match_all: {},
        },
        sort: ['createdAt'], // This sort is the only way we can make paging reliable. Sorting by "id" returns a 500, by "_doc" seems to have no effect. Sepana api is mysterious.
        size: MAX_SEPANA_PAGE_SIZE,
        page, // Page is a 1-based index (whyyyyyy sepana)
      },
    )

    if (total === undefined) total = data.hits.total.value

    if (total) {
      const _hits = data.hits.hits

      if (page * MAX_SEPANA_PAGE_SIZE > total) {
        // Sepana gives us a full pageSize of results in every query without a pointer, so we use the total to manually check that we aren't adding too many hits
        hits.push(..._hits.slice(0, total % MAX_SEPANA_PAGE_SIZE))
      } else {
        hits.push(..._hits)

        if (page === 1) {
          // After getting total in initial query, we concurrently await all subsequent queries to speed things up
          const promises = []

          for (let i = 2; i - 1 < total / MAX_SEPANA_PAGE_SIZE; i++) {
            promises.push(query(i))
          }

          await Promise.all(promises)
        }
      }
    }
  }

  await query(1)

  return { total, hits }
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
              fields: ['id'],
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
  const missingIds = records.filter(r => r.id === undefined || r.id === null)

  if (missingIds.length) {
    throw new Error(
      `${missingIds.length} records are missing an id: ${missingIds
        .map(p => JSON.stringify(p))
        .join(', ')}`,
    )
  }

  const jobs: string[] = []
  const errors: (string | object)[] = []
  const written: Json<SepanaProject>[] = []

  // Clone array because we mutate it
  const pageSize = 500
  let page = 0

  while (records.length > pageSize * page) {
    const queue = records
      .slice(pageSize * page, pageSize * (page + 1))
      .map(r => ({
        ...r,
        // Upserting data in Sepana requires the `_id` param to be included, so we always include it here using `_source.id`
        // https://docs.sepana.io/sepana-search-api/web3-search-cloud/search-api#request-example-2
        _id: r.id,
        _v: CURRENT_VERSION,
      }))

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

    page += 1
  }

  return { jobs, written, errors }
}
