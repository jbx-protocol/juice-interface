import { juiceAuthDbClient } from 'lib/api/supabase/clients'
import template from 'lodash/template'
import { NextApiRequest, NextApiResponse } from 'next'
import { v4 } from 'uuid'

const WalletSigningRequestMessageTemplate = template(
  'Sign this message to log into Juicebox.\n\nThis session will expire in 24hrs and you will be required to sign and login again.\n\nNo charges or gas fees will be made against your wallet.\n\nWallet: ${walletAddress}\nRequest ID: ${nonce}',
)

/**
 * Generate a challenge request message for wallet signing.
 *
 * Only GET requests are supported.
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method !== 'GET')
      return res.status(405).json({ message: 'Method not allowed.' })
    const { walletAddress } = req.query ?? {}
    if (!walletAddress || typeof walletAddress !== 'string') {
      return res.status(400).json({ message: 'Invalid request.' })
    }
    const walletAddressNormalized = walletAddress.toLowerCase()
    const nonce = v4()
    const challengeMessage = WalletSigningRequestMessageTemplate({
      nonce,
      walletAddress: walletAddressNormalized,
    })
    const { error } = await juiceAuthDbClient.from('signing_requests').insert({
      wallet_id: walletAddressNormalized,
      challenge_message: challengeMessage,
      nonce,
    })
    if (error) throw error
    return res.status(200).json({ challengeMessage })
  } catch (e) {
    console.error('Error occurred', e)
    return res.status(500).json({ message: 'Internal server error occurred.' })
  }
}

export default handler
