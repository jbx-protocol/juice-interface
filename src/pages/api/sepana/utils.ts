import axios from 'axios'
import {
  SepanaProject,
  SepanaProjectJson,
  SepanaSearchResponse,
} from 'models/sepana'

// if (!process.env.NEXT_PUBLIC_SEPANA_ENGINE_ID) {
//   console.log('asdf', process.env)
//   throw new Error('Missing NEXT_PUBLIC_SEPANA_ENGINE_ID')
// }

// if (!process.env.NEXT_PUBLIC_SEPANA_API_KEY) {
//   console.log('asdf', process.env)
//   throw new Error('Missing NEXT_PUBLIC_SEPANA_API_KEY')
// }

const headers = {
  'x-api-key': process.env.NEXT_PUBLIC_SEPANA_API_KEY!,
  'Content-Type': 'application/json',
}

/**
 * Exhaustively queries all Sepana records.
 *
 * @returns Promise containing all project docs from Sepana database
 *
 * TODO: Update this before we hit 10k projects (size: 10000).
 */
export async function queryAllSepanaProjects() {
  return axios.post<SepanaSearchResponse<SepanaProject>>(
    process.env.NEXT_PUBLIC_SEPANA_API_URL + 'search',
    {
      engine_ids: [process.env.NEXT_PUBLIC_SEPANA_ENGINE_ID],
      query: {
        match_all: {},
      },
      size: 10000,
      page: 0,
    },
    {
      headers,
    },
  )
}

/**
 * Search all Sepana project records
 *
 * @returns Promise containing project docs from Sepana database matching search params. If no query text is supplied, returns all projects
 */
export async function searchSepanaProjects(query = '', pageSize?: number) {
  return axios
    .post<SepanaSearchResponse<SepanaProjectJson>>(
      process.env.NEXT_PUBLIC_SEPANA_API_URL + 'search',
      {
        engine_ids: [process.env.NEXT_PUBLIC_SEPANA_ENGINE_ID],
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
        size: pageSize, // default 20
        page: 0,
      },
      {
        headers,
      },
    )
    .then(res => res.data)
}

/**
 * Deletes all Sepana records
 */
export async function deleteAllSepanaDocs() {
  return axios.delete(
    process.env.NEXT_PUBLIC_SEPANA_API_URL + 'engine/data/delete',
    {
      headers,
      data: {
        engine_id: process.env.NEXT_PUBLIC_SEPANA_ENGINE_ID,
        delete_query: {
          query: {
            match_all: {},
          },
        },
      },
    },
  )
}

/**
 * Writes docs to Sepana engine in groups of 500.
 *
 * @param docs Projects to write to Sepana database
 */
export async function writeSepanaDocs(docs: SepanaProjectJson[]) {
  while (docs[0]) {
    await axios.post(
      process.env.NEXT_PUBLIC_SEPANA_API_URL + 'engine/insert_data',
      {
        engine_id: process.env.NEXT_PUBLIC_SEPANA_ENGINE_ID,
        docs: docs.splice(0, 500), // upsert max of 500 docs at a time
      },
      {
        headers,
      },
    )

    if (docs[0]) {
      // Arbitrary delay to avoid rate limits
      await new Promise(r => setTimeout(r, 3000))
    }
  }
}
