import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { NextApiRequest, NextApiResponse } from 'next'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const address = req.query.address as string
  const supabase = createServerSupabaseClient({ req, res })

  async function getAccount() {
    const profileResult = await supabase
      .from('user_profiles')
      .select('*')
      .eq('wallet', address.toLowerCase())
      .maybeSingle()

    return res.status(200).json({ profileResult })
  }

  if (req.method === 'GET') {
    return getAccount()
  }

  // TODO migrate over the other PUT/POST methods

  return res.status(405).json({ error: 'Method not allowed' })
}

export default handler
