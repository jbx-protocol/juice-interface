import axios from 'axios'

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
  project: { cv: '1' | '1.1'; handle: string } | { cv: '2'; projectId: string },
) {
  return axios.post('/api/nextjs/revalidate-project', { project })
}
