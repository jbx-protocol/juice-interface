export const SEPANA_ENDPOINTS = {
  search: '/search',
  insert: '/engine/insert_data',
  job: (jobId: string) => `/job/status/${jobId}`,
}
