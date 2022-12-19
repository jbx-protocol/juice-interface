import axios from 'axios'
import {
  SepanaBigNumber,
  SepanaProject,
  SepanaSearchResponse,
} from 'models/sepana'

if (!process.env.SEPANA_ENGINE_ID) {
  throw new Error('Missing SEPANA_ENGINE_ID')
}

if (!process.env.SEPANA_API_KEY) {
  throw new Error('Missing SEPANA_API_KEY')
}

const headers = {
  'x-api-key': process.env.SEPANA_API_KEY,
  'Content-Type': 'application/json',
}

/**
 * Exhaustively queries all Sepana records.
 *
 * @returns Promise containing all project docs from Sepana database
 *
 * TODO: Update this before we hit 10k projects (size: 10000).
 */
export async function querySepanaProjects() {
  return axios.post<SepanaSearchResponse<SepanaProject>>(
    process.env.SEPANA_API_URL + 'search',
    {
      engine_ids: [process.env.SEPANA_ENGINE_ID],
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
 * Deletes all Sepana records
 */
export async function deleteAllSepanaDocs() {
  return axios.delete(process.env.SEPANA_API_URL + 'engine/data/delete', {
    headers,
    data: {
      engine_id: process.env.SEPANA_ENGINE_ID,
      delete_query: {
        query: {
          match_all: {},
        },
      },
    },
  })
}

/**
 * Writes docs to Sepana engine in groups of 500.
 *
 * @param docs Projects to write to Sepana database
 */
export async function writeSepanaDocs(docs: SepanaProject[]) {
  while (docs[0]) {
    await axios.post(
      process.env.SEPANA_API_URL + 'engine/insert_data',
      {
        engine_id: process.env.SEPANA_ENGINE_ID,
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

/**
 * Checks if a value matches the BigNumber type used in Sepana db
 *
 * @param val Value to check
 *
 * @returns True if value is Sepana BigNumber
 */
export function isSepanaBigNumber(val: unknown) {
  return (val as SepanaBigNumber).type === 'BigNumber'
}
