import axios from 'axios'
import * as admin from 'firebase-admin'
import { NextApiRequest, NextApiResponse } from 'next'
import { stringify } from 'querystring'
import { firestoreAdmin } from 'utils/firebase/firebaseAdmin'

const updateVerificationState = async (username: string) => {
  const pendingRequests = await firestoreAdmin
    .collection('twitterVerificationRequests')
    .where('twitter', '==', username)
    .get()
  pendingRequests.forEach(async doc => {
    const { twitter, projectId, cv } = doc.data()
    const compositeProjectId = `${cv}-${projectId}`
    if (twitter === username) {
      // update doc in twitterVerification collection
      await firestoreAdmin
        .collection('twitterVerification')
        .doc(compositeProjectId)
        .set({
          verified: true,
          verifiedAt: admin.firestore.FieldValue.serverTimestamp(),
          username,
        })
    }
  })
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (!req.query.code) {
    res.status(500).json({ error: 'No code provided from Twitter' })
  }

  const clientId = process.env.NEXT_PUBLIC_TWITTER_CLIENT_ID
  const clientSecret = process.env.TWITTER_CLIENT_SECRET

  // base64 encode clientId:clientSecret
  const encodedCredentials = Buffer.from(
    `${clientId}:${clientSecret}`,
  ).toString('base64')

  try {
    const { data } = await axios.post(
      'https://api.twitter.com/2/oauth2/token',
      stringify({
        client_id: process.env.NEXT_PUBLIC_TWITTER_CLIENT_ID,
        redirect_uri: `${process.env.NEXT_PUBLIC_TWITTER_REDIRECT_URI}`,
        grant_type: 'authorization_code',
        code: req.query.code,
        code_verifier: 'challenge',
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${encodedCredentials}`,
        },
      },
    )
    const { access_token } = data
    const userData = await axios.get('https://api.twitter.com/2/users/me', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    })
    const { username } = userData.data.data
    await updateVerificationState(username)
    return res.redirect(`/auth/success`)
  } catch (e) {
    return res.status(500).json({ error: 'Something went wrong' })
  }
}

export default handler
