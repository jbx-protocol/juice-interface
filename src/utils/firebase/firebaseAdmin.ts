import * as admin from 'firebase-admin'

if (!admin.apps.length && process.env.FIREBASE_PRIVATE_KEY) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
  })
}

const firestoreAdmin = admin.firestore()
const authAdmin = admin.auth()

export { firestoreAdmin, authAdmin }
