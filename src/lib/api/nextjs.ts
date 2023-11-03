import axios from 'axios'
import { PV1, PV2 } from 'models/pv'
import { NextApiResponse } from 'next'

/**
 * Calls to the NextJS API `/api/nextjs/revalidate-project` to revalidate the
 * project cache data.
 *
 * This should be called every time the metadata of a project is updated to
 * ensure that metadata is kept up to date on the project.
 *
 * @param project Information related to the project for metadata to be updated.
 * @returns {Promise<AxiosResponse>} Promise related to the axios call.
 */
export function revalidateProject(
  project: { pv: PV1; handle: string } | { pv: PV2; projectId: string },
) {
  return axios.post('/api/nextjs/revalidate-project', { project })
}

/**
 * Enables CORS for a NextJS API endpoint response.
 * @link https://vercel.com/guides/how-to-enable-cors#enabling-cors-in-a-next.js-app
 */
export function enableCors(res: NextApiResponse) {
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
  )
}
