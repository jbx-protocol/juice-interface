import axios from 'axios'
import { NextApiRequest, NextApiResponse } from 'next'
import { stringify } from 'querystring'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (!req.query.code) {
    res.status(404).redirect('/404')
    return
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
    return res.status(200).json({ username, verification: 'success' })
  } catch (e) {
    return res.status(500).json({ error: 'Something went wrong' })
  }
}

export default handler
