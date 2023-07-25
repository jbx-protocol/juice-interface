import { sudoPublicDbClient } from 'lib/api/supabase/clients'
import { NextApiRequest, NextApiResponse } from 'next'
import { buildJwt, getOrCreateUser } from './utils'

/**
 * Sign in a keyp wallet without requiring a signature.
 *
 * Only POST requests are supported.
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method !== 'POST')
      return res.status(405).json({ message: 'Method not allowed.' })

    const { walletAddress } = req.body ?? {}
    if (!walletAddress || typeof walletAddress !== 'string') {
      return res.status(400).json({ message: 'Invalid request.' })
    }

    const walletAddressNormalized = walletAddress.toLowerCase()

    const user = await getOrCreateUser(
      sudoPublicDbClient,
      walletAddressNormalized,
    )
    const jwt = buildJwt(user)

    return res.status(200).json({ accessToken: jwt })
  } catch (e) {
    console.error('Error occurred', e)
    return res.status(500).json({ message: 'Internal server error occurred.' })
  }
}

export default handler
