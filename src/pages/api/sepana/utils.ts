import axios from 'axios'
import { SepanaProject } from './models'

if (!process.env.SEPANA_API_KEY) {
  throw new Error('Missing process.env.SEPANA_API_KEY')
}

if (!process.env.SEPANA_ENGINE_ID) {
  throw new Error('Missing process.env.SEPANA_ENGINE_ID')
}

const headers = {
  'x-api-key': process.env.SEPANA_API_KEY,
  'Content-Type': 'application/json',
}

// Exhaustively queries all Sepana records.
// TODO: Update this before we hit 10k projects (size: 10000).
export async function querySepanaProjects() {
  return axios.post<{ hits: { hits: { _source: SepanaProject }[] } }>(
    process.env.SEPANA_URL + 'search',
    {
      headers,
      body: {
        engine_ids: [process.env.SEPANA_ENGINE_ID],
        query: {
          match_all: {},
        },
        size: 10000,
        page: 0,
      },
    },
  )
}

// Deletes Sepana records with ids inside parameter array.
export async function deleteSepanaIds(ids: string[]) {
  return axios.delete(process.env.SEPANA_API_KEY + 'engine/data/delete', {
    headers,
    data: {
      engine_id: process.env.SEPANA_ENGINE_ID,
      delete_query: {
        query: {
          terms: {
            id: ids,
          },
        },
      },
    },
  })
}

// Writes docs to Sepana engine in groups of 500.
export async function writeSepanaDocs(docs: SepanaProject[]) {
  while (docs[0]) {
    await axios.post(process.env.SEPANA_URL + 'engine/insert_data', {
      headers,
      body: {
        engine_id: process.env.SEPANA_ENGINE_ID,
        docs: docs.splice(0, 500), // upsert up to 500 docs and delete from original array
      },
    })

    if (docs[0]) {
      // Arbitrary delay to avoid rate limits
      await new Promise(r => setTimeout(r, 3000))
    }
  }
}
