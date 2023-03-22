import axios from 'axios'

export function fetchProjectHandle(projectId: string | number) {
  return axios
    .get<{ handle: string }>(`/api/juicebox/projectHandle/${projectId}`)
    .then(data => data.data.handle)
}
