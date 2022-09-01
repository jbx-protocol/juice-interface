import axios from 'axios'
import { useQuery } from 'react-query'

export interface TwitterVerificationInfo {
  verified: boolean
  handle: string
  verifiedAt: number
}

const useTwitterVerified = (projectId: string | undefined) => {
  const verificationFileUri = process.env
    .NEXT_PUBLIC_TWITTER_VERIFICATION_FILE_URI as string
  return useQuery('twitter-verified', async () => {
    if (!projectId) {
      return
    }
    const { data } = await axios.get(verificationFileUri)
    const verificationInfo = data[projectId]?.twitter as TwitterVerificationInfo
    return verificationInfo
  })
}

export default useTwitterVerified
