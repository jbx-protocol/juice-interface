import { CV } from 'models/cv'

export const compositeProjectId = (projectId: number, cv: CV) => {
  return `${coercedCv(cv)}-${projectId}`
}

export const coercedCv = (cv: CV) => {
  if (cv === '1.1') {
    return '1'
  }
  return cv
}
