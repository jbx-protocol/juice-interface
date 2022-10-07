import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { doc } from 'firebase/firestore'
import { useContext } from 'react'
import { useDocumentData } from 'react-firebase-hooks/firestore'
import { firestore } from 'utils/firebase/firebaseApp'

export interface TwitterVerificationInfo {
  verified: boolean
  username: string
  verifiedAt: number
}

const useTwitterVerified = () => {
  const { projectId, cv } = useContext(ProjectMetadataContext)
  return useDocumentData(
    doc(firestore, 'twitterVerification', `${projectId}-${cv}`),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    },
  )
}

export default useTwitterVerified
