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
    const { email } = req.body ?? {}
    if (!email) {
      return res.status(400).json({ message: 'Invalid request.' })
    }

    await supabase.auth.updateUser({ email })
    // const a = await sudoPublic.auth.admin.updateUserById(
    //   session.data.session.user.id,
    //   {
    //     email,
    //     email_confirm: false,
    //   },
    // )

    // const a = await sudoPublic.auth.admin.generateLink({
    //   type: 'email_change_new',
    //   email: response.data.user?.email ?? '',
    //   newEmail: email,
    // })
    return res.status(200).json('the boys')
    // if (req.method !== 'POST') {
    //   return res.status(405).json({ message: 'Method not allowed.' })
    // }
    // const { email } = req.body ?? {}
    // if (!email) {
    //   return res.status(400).json({ message: 'Invalid request.' })
    // }
    // const password = v4()

    // supabase.auth.admin.generateLink({
    //   type: 'email_change_new',
    //   email:
    // })

    // const result = await supabase.auth.signUp({ email, password })
    // if (result.error) {
    //   throw result.error
    // }
    // return res.status(200).json(result.data)
  } catch (e) {
    console.error('Error occurred', e)
    return res.status(500).json({ message: 'Internal server error occurred.' })
  }
}

export default handler
