import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { NextApiRequest, NextApiResponse } from 'next'
import { YUP_TWITTER } from 'utils/yup'
import * as Yup from 'yup'

const Schema = Yup.object().shape({
  bio: Yup.string()
    .max(2048, 'Bio cannot be greater than 2048 characters')
    .nullable(),
  email: Yup.string()
    .email('Invalid email')
    .max(320, 'Invalid email')
    .nullable(),
  website: Yup.string().url('Invalid URL').max(2048, 'Invalid URL').nullable(),
  twitter: YUP_TWITTER,
})

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

    let bio, email, website, twitter
    try {
      const result = await Schema.validate(req.body)
      bio = result.bio
      email = result.email
      website = result.website
      twitter = result.twitter
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      console.error('Error occurred', e)
      return res
        .status(400)
        .json({ message: e?.errors?.[0] ?? 'Unexpected error.' })
    }

    if (email) {
      const emailResult = await supabase.auth.updateUser({ email })
      if (emailResult.error) {
        if (emailResult.error.status === 422) {
          return res
            .status(409)
            .json({ message: 'Email is already registered.' })
        }
        throw emailResult.error
      }
    }
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
