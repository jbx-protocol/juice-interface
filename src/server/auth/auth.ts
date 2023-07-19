import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { NextApiRequest, NextApiResponse } from 'next'

/**
 *  Authenticates a user.
 */
export const authenticateUserApiCall = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  const supabase = createServerSupabaseClient({ req, res })
  const session = await supabase.auth.getSession()
  if (!session.data.session)
    return res.status(401).json({ message: 'Unauthorized.' })
  return session.data.session
}
