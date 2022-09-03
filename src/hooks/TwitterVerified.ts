import { doc } from 'firebase/firestore'
import { useDocumentData } from 'react-firebase-hooks/firestore'
import { firestore } from 'utils/firebase'

export interface TwitterVerificationInfo {
  verified: boolean
  username: string
  verifiedAt: number
}

const useTwitterVerified = (projectId: string) => {
  return useDocumentData(doc(firestore, 'twitterVerification', projectId), {
    snapshotListenOptions: { includeMetadataChanges: true },
  })
}

export default useTwitterVerified
