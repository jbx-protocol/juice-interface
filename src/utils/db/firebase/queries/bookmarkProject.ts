import { firestore } from 'firebase-admin'
import { CV } from 'models/cv'
import { compositeProjectId } from 'utils/db/dbUtils'
import { firestoreAdmin } from 'utils/db/firebase/firebaseAdmin'

export const bookmarkProject = (address: string, projectId: number, cv: CV) => {
  const compositeId = compositeProjectId(projectId, cv)
  return firestoreAdmin
    .collection('bookmarks')
    .doc(address)
    .set(
      {
        [compositeId]: true,
      },
      { merge: true },
    )
}

export const unbookmarkProject = (
  address: string,
  projectId: number,
  cv: CV,
) => {
  const compositeId = compositeProjectId(projectId, cv)
  return firestoreAdmin
    .collection('bookmarks')
    .doc(address)
    .update({
      [compositeId]: firestore.FieldValue.delete(),
    })
}
