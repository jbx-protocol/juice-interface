import { SupabaseClient } from '@supabase/supabase-js'
import { utils } from 'ethers'
import { juiceAuthDbClient, sudoPublicDbClient } from 'lib/api/supabase/clients'
import { NextApiRequest, NextApiResponse } from 'next'
import { Database } from 'types/database.types'
import { buildJwt, getOrCreateUser } from './utils'

/**
 * Sign in a wallet after verifying a signature challenge.
 *
 * Only POST requests are supported.
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method !== 'POST')
      return res.status(405).json({ message: 'Method not allowed.' })

    const { walletAddress, message, signature } = req.body ?? {}
    if (!walletAddress || typeof walletAddress !== 'string') {
      return res.status(400).json({ message: 'Invalid request.' })
    }
    if (!message || typeof walletAddress !== 'string') {
      return res.status(400).json({ message: 'Invalid request.' })
    }
    if (!signature || typeof walletAddress !== 'string') {
      return res.status(400).json({ message: 'Invalid request.' })
    }
    const walletAddressNormalized = walletAddress.toLowerCase()

    const signingRequestResult = await juiceAuthDbClient
      .from('signing_requests')
      .select('challenge_message, wallet_id, nonce')
      .eq('wallet_id', walletAddressNormalized)
      .eq('challenge_message', message)
      .gt('expires_at', new Date().toISOString())
      .maybeSingle()
    if (signingRequestResult.error) throw signingRequestResult.error
    if (!signingRequestResult.data) {
      return res.status(401).json({ message: 'Unauthorized.' })
    }

    const walletAddressUsedForRequestSign = utils
      .recoverAddress(
        utils.hashMessage(signingRequestResult.data.challenge_message),
        signature,
      )
      .toLowerCase()
    if (walletAddressUsedForRequestSign !== walletAddressNormalized) {
      console.warn(
        'Wallet signed with address that is foreign to the request',
        {
          walletAddressUsedForRequestSign,
          requestWallet: walletAddressNormalized,
          signature,
        },
      )
      return res.status(401).json({ message: 'Unauthorized.' })
    }

    const user = await getOrCreateUser(
      sudoPublicDbClient,
      walletAddressNormalized,
    )
    const jwt = buildJwt(user)

    await deleteSigningRequest(juiceAuthDbClient, signingRequestResult.data)

    return res.status(200).json({ accessToken: jwt })
  } catch (e) {
    console.error('Error occurred', e)
    return res.status(500).json({ message: 'Internal server error occurred.' })
  }
}

const deleteSigningRequest = async (
  supabase: SupabaseClient<Database, 'juice_auth'>,
  signingRequest: { wallet_id: string; nonce: string },
) => {
  const { error: deleteError } = await supabase
    .from('signing_requests')
    .delete()
    .eq('wallet_id', signingRequest.wallet_id)
    .eq('nonce', signingRequest.nonce)
  if (deleteError) throw deleteError
}

export default handler
