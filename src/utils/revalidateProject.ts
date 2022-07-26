import axios from 'axios'

export function revalidateProject(
  project: { cv: '1' | '1.1'; handle: string } | { cv: '2'; projectId: string },
) {
  return axios.post('/api/nextjs/revalidate-project', { project })
}
