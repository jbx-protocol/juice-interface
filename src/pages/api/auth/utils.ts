import { SupabaseClient } from '@supabase/supabase-js'
import * as jsonwebtoken from 'jsonwebtoken'
import { Database } from 'types/database.types'

export const getOrCreateUser = async (
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

export const buildJwt = (user: { id: string }, exp = twentyFourHoursInMs) => {
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
