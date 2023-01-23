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
    `${process.env.NEXT_PUBLIC_SEPANA_API_URL}/search`,
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
      `${process.env.NEXT_PUBLIC_SEPANA_API_URL}/search`,
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
    `${process.env.NEXT_PUBLIC_SEPANA_API_URL}/engine/data/delete`,
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
 * Deletes a Sepana record with ID
 * @param id ID of Sepana record to delete
 */
export async function deleteSepanaDoc(id: string) {
  return axios.delete<{ detail: string }>(
    `${process.env.NEXT_PUBLIC_SEPANA_API_URL}/engine/data/delete`,
    {
      headers: headers('admin'),
      data: {
        engine_id: process.env.SEPANA_ENGINE_ID,
        delete_query: {
          query: {
            match: {
              id,
            },
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
  const jobs: string[] = []
  const projects: SepanaProjectJson[] = []

  // Clone array because we mutate it
  const pageSize = 500
  let page = 0

  while (docs.length > pageSize * page) {
    const docsToWrite = docs.slice(pageSize * page, pageSize * (page + 1))

    await axios
      .post<{ job_id: string }>(
        `${process.env.NEXT_PUBLIC_SEPANA_API_URL}/engine/insert_data`,
        {
          engine_id: process.env.SEPANA_ENGINE_ID,
          docs: docsToWrite,
        },
        {
          headers: headers('read/write'),
        },
      )
      .then(res => {
        jobs.push(res.data.job_id)
        projects.push(...docsToWrite)
      })

    if (docs.length > pageSize * (page + 1)) {
      // Arbitrary delay to avoid rate limits
      await new Promise(r => setTimeout(r, 3000))
    }

    page++
  }

  return { jobs, projects }
}

export async function getJobs(jobIds: string[]) {
  return Promise.all(jobIds.map(getJob))
}

export async function getJob(jobId: string) {
  return axios.get<{
    job_id: string
    engine_id: string
    status: string
    message: string
    request_timestamp: string
    completion_timestamp: string
  }>(`${process.env.NEXT_PUBLIC_SEPANA_API_URL}/job/status/${jobId}`, {
    headers: headers('read'),
  })
}

const SEPANA_ALERTS = {
  DB_UPDATE_ERROR: 'Error updating database',
  DELETED_ALL_RECORDS: 'Deleted all records',
  DELETED_RECORD: 'Deleted record',
  DELETE_ERROR: 'Error deleting records',
  BAD_DB_HEALTH: 'Errors in database',
}

const SEPANA_NOTIFS = {
  DB_UPDATED: 'Records updated',
  DB_OK: 'Database is OK',
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
    body?: string
  },
) {
  const network = process.env.NEXT_PUBLIC_INFURA_NETWORK
  const url = process.env.SEPANA_WEBHOOK_URL

  if (!url || !network) {
    console.error('Missing .env var required to log Sepana Alert')
    return
  }

  return await axios.post(url, {
    content: `${opts.type === 'alert' ? '🚨' : ''} **${
      opts.type === 'alert'
        ? SEPANA_ALERTS[opts.alert]
        : SEPANA_NOTIFS[opts.notif]
    }** (${network})${
      opts.type === 'alert' ? ' <@&1064689520848674888>' : '' // @dev discord role id
    }${opts.body ? `\n${opts.body}` : ''}`.substring(0, 2000), // Max size of Discord message
  })
}
