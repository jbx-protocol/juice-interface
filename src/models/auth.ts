import { CV } from 'models/cv'

export interface TwitterVerification {
  username: string
  verified: boolean
  verifiedAt: number
}

export interface TwitterVerificationRequest {
  twitter: string
  initiatedAt: number
  projectId: number
  cv: CV
}
