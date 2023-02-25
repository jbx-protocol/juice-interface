import axios from 'axios'
import { PV1, PV2 } from 'models/pv'

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
