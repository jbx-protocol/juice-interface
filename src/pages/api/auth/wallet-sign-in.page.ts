import { hashMessage } from '@ethersproject/hash'
import { recoverAddress } from '@ethersproject/transactions'
import { createClient } from '@supabase/supabase-js'
import { Database } from 'generated/database.types'
import * as jsonwebtoken from 'jsonwebtoken'
import { NextApiRequest, NextApiResponse } from 'next'

/**
 * Sign in a wallet.
 *
 * Only POST requests are supported.
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const juiceAuth = createClient<Database, 'juice_auth'>(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      { db: { schema: 'juice_auth' } },
    )
    const sudoPublic = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      { db: { schema: 'public' } },
    )
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

    const { data: signingRequestsData, error: signingRequestsError } =
      await juiceAuth
        .from('signing_requests')
        .select('challenge_message, wallet_id, nonce')
        .eq('wallet_id', walletAddressNormalized)
        .eq('challenge_message', message)
        .gt('expires_at', new Date().toISOString())
        .single()
    if (signingRequestsError) throw signingRequestsError
    if (!signingRequestsData) {
      return res.status(401).json({ message: 'Unauthorized.' })
    }

    const walletAddressUsedForRequestSign = recoverAddress(
      hashMessage(signingRequestsData.challenge_message),
      signature,
    ).toLowerCase()
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

    let user: Database['public']['Tables']['users']['Row']
    const { data: usersData, error: usersError } = await sudoPublic
      .from('users')
      .select('*')
      .eq('wallet', walletAddressNormalized)
      .maybeSingle()
    if (usersError) throw usersError

    if (!usersData) {
      const userCreation = await sudoPublic.auth.admin.createUser({
        email: `${walletAddressNormalized}@juicebox.money`,
        email_confirm: false,
      })
      if (userCreation.error) throw userCreation.error
      if (!userCreation.data) throw new Error('Failed to create auth user')
      const insertResult = await sudoPublic
        .from('users')
        .insert({
          id: userCreation.data.user.id,
          wallet: walletAddressNormalized,
        })
        .select()
        .single()
      if (insertResult.error) throw insertResult.error
      if (!insertResult.data) throw new Error('Bad insert on user data')
      user = insertResult.data
    } else {
      user = usersData
    }

    const oneDayLater = new Date().getTime() + 24 * 60 * 60 * 1000
    const jwtExpiry = Math.floor(oneDayLater / 1000)
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

    // Build HS256 JWT

    const { error: deleteError } = await juiceAuth
      .from('signing_requests')
      .delete()
      .eq('wallet_id', signingRequestsData.wallet_id)
      .eq('nonce', signingRequestsData.nonce)
    if (deleteError) throw deleteError

    return res.status(200).json({ accessToken: jwt })
  } catch (e) {
    console.error('Error occurred', e)
    return res.status(500).json({ message: 'Internal server error occurred.' })
  }
}

export default handler
