import { SEPANA_ENDPOINTS } from './endpoints'
import { sepanaAxios } from './network'

export async function getJobs(jobIds: string[]) {
  return Promise.all(jobIds.map(getJob))
}

export async function getJob(jobId: string) {
  return sepanaAxios('read').get<{
    job_id: string
    engine_id: string
    status: string
    message: string
    request_timestamp: string
    completion_timestamp: string
  }>(SEPANA_ENDPOINTS.job(jobId))
}
