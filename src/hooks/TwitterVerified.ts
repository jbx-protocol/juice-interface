import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { doc } from 'firebase/firestore'
import { TwitterVerification } from 'models/auth'
import { useContext } from 'react'
import { useDocumentData } from 'react-firebase-hooks/firestore'
import { firestore } from 'utils/firebase/firebaseApp'

const useTwitterVerified = () => {
  const { projectId, cv } = useContext(ProjectMetadataContext)
  const [value] = useDocumentData(
    doc(firestore, 'twitterVerification', `${cv}-${projectId}`),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    },
  )
  return value as TwitterVerification
}

export default useTwitterVerified
