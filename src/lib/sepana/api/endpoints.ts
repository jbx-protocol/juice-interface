export const SEPANA_ENDPOINTS = {
  search: '/search',
  delete: '/engine/data/delete',
  insert: '/engine/insert_data',
  job: (jobId: string) => `/job/status/${jobId}`,
}
