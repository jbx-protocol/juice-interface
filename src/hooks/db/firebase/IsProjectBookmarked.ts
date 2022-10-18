import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { doc } from 'firebase/firestore'
import { useWallet } from 'hooks/Wallet'
import { useContext } from 'react'
import { useDocumentData } from 'react-firebase-hooks/firestore'
import { firestore } from 'utils/db/firebase/firebaseApp'

export const useIsProjectBookmarked = () => {
  const { userAddress } = useWallet()
  const { projectId, cv } = useContext(ProjectMetadataContext)
  if (!userAddress || !projectId || !cv) {
    return null
  }
  return useDocumentData(doc(firestore, 'bookmarks', userAddress))
}
