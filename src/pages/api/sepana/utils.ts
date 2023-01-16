import axios from 'axios'
import {
  SepanaProject,
  SepanaProjectJson,
  SepanaSearchResponse,
} from 'models/sepana'

const headers = (type: 'read' | 'read/write' | 'admin') => {
  let key: string

  switch (type) {
    case 'read':
      if (!process.env.SEPANA_READ_API_KEY) {
        throw new Error('Missing SEPANA_READ_API_KEY')
      }
      key = process.env.SEPANA_READ_API_KEY
      break
    case 'read/write':
      if (!process.env.SEPANA_READ_WRITE_API_KEY) {
        throw new Error('Missing SEPANA_READ_WRITE_API_KEY')
      }
      key = process.env.SEPANA_READ_WRITE_API_KEY
      break
    case 'admin':
      if (!process.env.SEPANA_ADMIN_API_KEY) {
        throw new Error('Missing SEPANA_ADMIN_API_KEY')
      }
      key = process.env.SEPANA_ADMIN_API_KEY
      break
  }

  return {
    'x-api-key': key,
    'Content-Type': 'application/json',
  }
}

/**
 * Exhaustively queries all Sepana records.
 *
 * @returns Promise containing all project docs from Sepana database
 */
export async function queryAllSepanaProjects() {
  return axios.post<SepanaSearchResponse<SepanaProject>>(
    process.env.NEXT_PUBLIC_SEPANA_API_URL + 'search',
    {
      engine_ids: [process.env.SEPANA_ENGINE_ID],
      query: {
        match_all: {},
      },
      size: 10000, // TODO: Update this before we hit 10k projects
      page: 0,
    },
    {
      headers: headers('read'),
    },
  )
}

/**
 * Search all Sepana project records, using preconfigured elastic search field weights and script source.
 *
 * @param query text to search
 * @param pageSize max number of results to return
 * @returns Promise containing project docs from Sepana database matching search params. If no query text is supplied, returns all projects
 */
export async function searchSepanaProjects(query = '', pageSize?: number) {
  return axios
    .post<SepanaSearchResponse<SepanaProjectJson>>(
      process.env.NEXT_PUBLIC_SEPANA_API_URL + 'search',
      {
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
        size: pageSize, // default 20
        page: 0,
      },
      {
        headers: headers('read'),
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
      headers: headers('admin'),
      data: {
        engine_id: process.env.SEPANA_ENGINE_ID,
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
        engine_id: process.env.SEPANA_ENGINE_ID,
        docs: docs.splice(0, 500), // upsert max of 500 docs at a time
      },
      {
        headers: headers('read/write'),
      },
    )

    if (docs[0]) {
      // Arbitrary delay to avoid rate limits
      await new Promise(r => setTimeout(r, 3000))
    }
  }
}

const SEPANA_ALERTS = {
  DB_UPDATE_ERROR: 'Error updating database',
  IPFS_RESOLUTION_ERROR: 'Error resolving IPFS data',
  DELETED_ALL_RECORDS: 'All records deleted from database',
  DELETE_ERROR: 'Error deleting record(s) from database',
  BAD_DB_HEALTH: 'Error(s) detected in database',
}

const SEPANA_NOTIFS = {
  DB_UPDATED: 'Database records updated',
}

export async function sepanaAlert(
  opts: (
    | {
        type: 'alert'
        alert: keyof typeof SEPANA_ALERTS
      }
    | {
        type: 'notification'
        notif: keyof typeof SEPANA_NOTIFS
      }
  ) & {
    body?: Record<string, string | number | undefined | null>
  },
) {
  const network = process.env.NEXT_PUBLIC_INFURA_NETWORK
  const url = process.env.SEPANA_WEBHOOK_URL

  if (!url || !network) {
    throw new Error('Missing var to post to Discord webhook')
  }

  return await axios.post(url, {
    content: `${opts.type === 'alert' ? '🚨 ' : ''}**${
      network !== 'mainnet' ? `(${network}) ` : ''
    }${opts.type.toUpperCase()}:** ${
      opts.type === 'alert'
        ? SEPANA_ALERTS[opts.alert]
        : SEPANA_NOTIFS[opts.notif]
    }${Object.entries(opts.body ?? {})
      .map(([k, v]) => `\n**${k}:** ${v}`)
      .join('')}${
      opts.type === 'alert' ? '\n\n<@&939995661963784202>' : '' // @dev discord role id
    }`,
  })
}
