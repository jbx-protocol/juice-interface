import { doc } from 'firebase/firestore'
import { useWallet } from 'hooks/Wallet'
import { useDocumentData } from 'react-firebase-hooks/firestore'
import { firestore } from 'utils/db/firebase/firebaseApp'

export const useProjectBookmarks = () => {
  const { userAddress } = useWallet()
  const address = userAddress ? userAddress : ''
  return useDocumentData(doc(firestore, 'bookmarks', address))
}
