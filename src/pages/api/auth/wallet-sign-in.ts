import { SupabaseClient } from '@supabase/supabase-js'
import { utils } from 'ethers'
import { isAddress } from 'ethers/lib/utils'
import * as jsonwebtoken from 'jsonwebtoken'
import { juiceAuthDbClient, sudoPublicDbClient } from 'lib/api/supabase/clients'
import { NextApiRequest, NextApiResponse } from 'next'
import { Database } from 'types/database.types'

/**
 * Sign in a wallet.
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
    if (!isAddress(walletAddress)) {
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

const getOrCreateUser = async (
  supabase: SupabaseClient<Database>,
  walletAddress: string,
) => {
  let user: { id: string }
  const userLookup = await supabase
    .from('users')
    .select('id')
    .eq('wallet', walletAddress)
    .maybeSingle()
  if (userLookup.error) throw userLookup.error

  if (!userLookup.data) {
    const userCreation = await supabase.auth.admin.createUser({
      email: `${walletAddress}@juicebox.money`,
      email_confirm: false,
    })
    if (userCreation.error) throw userCreation.error
    if (!userCreation.data) throw new Error('Failed to create auth user')
    const insertResult = await supabase
      .from('users')
      .insert({
        id: userCreation.data.user.id,
        wallet: walletAddress,
      })
      .select('id')
      .single()
    if (insertResult.error) throw insertResult.error
    if (!insertResult.data) throw new Error('Bad insert on user data')
    user = insertResult.data
  } else {
    user = userLookup.data
  }
  return user
}

const twentyFourHoursInMs = 24 * 60 * 60 * 1000

const buildJwt = (user: { id: string }, exp = twentyFourHoursInMs) => {
  const expMs = new Date().getTime() + exp
  const jwtExpiry = Math.floor(expMs / 1000)
  const jwt = jsonwebtoken.sign(
    {
      sub: user.id,
      aud: 'authenticated',
      role: 'authenticated',
      iss: 'juicebox',
      exp: jwtExpiry,
    },
    process.env.SUPABASE_JWT_SECRET,
  )
  return jwt
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
