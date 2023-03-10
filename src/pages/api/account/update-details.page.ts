import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { NextApiRequest, NextApiResponse } from 'next'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const supabase = createServerSupabaseClient({ req, res })
    const session = await supabase.auth.getSession()
    if (!session.data.session) {
      return res.status(401).json({ message: 'Unauthorized.' })
    }
    if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Method not allowed.' })
    }

    const { bio, email, website, twitter } = req.body ?? {}
    if (!email) {
      return res.status(400).json({ message: 'Invalid request.' })
    }

    const emailResult = await supabase.auth.updateUser({ email })
    if (emailResult.error) throw emailResult.error
    const userResult = await supabase
      .from('users')
      .update({ bio, website, twitter })
      .eq('id', session.data.session.user.id)
    if (userResult.error) throw userResult.error

    return res.status(200).json('Success')
  } catch (e) {
    console.error('Error occurred', e)
    return res.status(500).json({ message: 'Internal server error occurred.' })
  }
}

export default handler
