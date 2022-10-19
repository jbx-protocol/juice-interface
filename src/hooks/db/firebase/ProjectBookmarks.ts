import { doc } from 'firebase/firestore'
import { useWallet } from 'hooks/Wallet'
import { useDocumentData } from 'react-firebase-hooks/firestore'
import { firestore } from 'utils/db/firebase/firebaseApp'

export const useProjectBookmarks = () => {
  const { userAddress } = useWallet()
  if (!userAddress) {
    return null
  }
  return useDocumentData(doc(firestore, 'bookmarks', userAddress))
}
